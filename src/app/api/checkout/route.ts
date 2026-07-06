import { NextResponse } from 'next/server';
import { stripe, calculatePlatformCommission } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const { menuItemId, name, priceInPence, partnerStripeAccountId } = await request.json();

    if (!menuItemId || !priceInPence || !partnerStripeAccountId) {
      return NextResponse.json(
        { error: 'Missing mandatory checkout parameters.' },
        { status: 400 }
      );
    }

    // Explicit calculation of the strict 10% platform commission fee
    const platformCommissionFee = calculatePlatformCommission(priceInPence);

    // Create a Stripe Checkout Session with Direct Charges & Split Commission
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: name || 'Exclusive Venue Deal',
            },
            unit_amount: priceInPence,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformCommissionFee,
        transfer_data: {
          destination: partnerStripeAccountId,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Session routing failure:', error);
    return NextResponse.json(
      { error: error.message || 'Internal payment processing configuration exception.' },
      { status: 500 }
    );
  }
}