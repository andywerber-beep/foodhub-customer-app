'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase, Venue } from '@/hooks/useSupabaseData';

interface OfferItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}

function MenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const venueId = searchParams.get('id');

  const [venue, setVenue] = useState<Venue | null>(null);
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState(true);

  const offersSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!venueId) return;

    async function fetchVenueOfferData() {
      try {
        setLoading(true);

        const { data: venueData } = await supabase
          .from('partners')
          .select('id, name, cuisine_type, status, town, postcode, address1, website_url')
          .eq('id', venueId)
          .single();

        if (venueData) setVenue(venueData);

        const { data: offerData } = await supabase
          .from('offers')
          .select('id, title, description, discount_price, image_url')
          .eq('venue_id', venueId);

        if (offerData) {
          const mappedOffers: OfferItem[] = offerData.map((off: any) => ({
            id: off.id,
            name: off.title,
            description: off.description,
            price: off.discount_price,
            image_url: off.image_url
          }));
          setOffers(mappedOffers);
        }
      } catch (err) {
        console.error('Error fetching lookbook data details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchVenueOfferData();
  }, [venueId]);

  const scrollToOffers = () => {
    offersSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', fontFamily: '-apple-system, sans-serif' }}>
        <div style={{ color: '#666666' }}>Loading Venue Space...</div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: '-apple-system, sans-serif' }}>
        <h3>Venue profile could not be located.</h3>
        <button onClick={() => router.push('/')} style={{ background: '#111', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', marginTop: '10px' }}>
          Back to Map
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh' }}>
      
      {/* Header Profile Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px 8px' }}>
          ←
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#111111', letterSpacing: '-0.02em' }}>{venue.name}</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#666666', textTransform: 'capitalize' }}>{venue.cuisine_type}</p>
        </div>
      </div>

      {/* Action Route Separator Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
        <button 
          onClick={scrollToOffers}
          disabled={offers.length === 0}
          style={{ 
            padding: '14px', 
            borderRadius: '12px', 
            border: 'none', 
            backgroundColor: offers.length > 0 ? '#111111' : '#f5f5f5', 
            color: offers.length > 0 ? '#ffffff' : '#aaaaaa', 
            fontSize: '14px', 
            fontWeight: 600, 
            cursor: offers.length > 0 ? 'pointer' : 'not-allowed',
            textAlign: 'center'
          }}
        >
          View Live Flash Offer {offers.length > 0 ? `(${offers.length})` : ''}
        </button>

        <a 
          href={venue.website_url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            padding: '14px', 
            borderRadius: '12px', 
            border: '1px solid #eaeaea', 
            backgroundColor: venue.website_url ? '#ffffff' : '#fdfdfd', 
            color: venue.website_url ? '#111111' : '#aaaaaa', 
            fontSize: '14px', 
            fontWeight: 600, 
            textDecoration: 'none',
            textAlign: 'center',
            pointerEvents: venue.website_url ? 'auto' : 'none'
          }}
        >
          Visit Website & Bookings
        </a>
      </div>

      <hr style={{ border: 'none', height: '1px', backgroundColor: '#eaeaea', marginBottom: '24px' }} />

      {/* Offers Showcase Node Section */}
      <div ref={offersSectionRef} style={{ scrollMarginTop: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111111', marginBottom: '16px' }}>Signature Items & Experience Deals</h3>

        {offers.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#888', fontSize: '14px' }}>
            No exclusive items posted for this venue yet. Check back soon!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {offers.map((item: OfferItem) => (
              <div 
                key={item.id} 
                style={{ 
                  backgroundColor: '#111111', 
                  borderRadius: '16px', 
                  padding: '20px', 
                  display: 'flex', 
                  gap: '16px', 
                  alignItems: 'center', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)' 
                }}
              >
                {item.image_url && (
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #222' }} 
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ backgroundColor: '#1c3d1c', color: '#4ade80', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px', letterSpacing: '0.05em' }}>
                      ACTIVE FOR 24 HOURS
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>{item.name}</h4>
                  <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#aaaaaa', lineHeight: '1.4' }}>{item.description}</p>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#f06262' }}>£{item.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default function MenuLookbookPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', fontFamily: '-apple-system, sans-serif' }}>
        <div style={{ color: '#666666' }}>Loading Lookbook Configuration...</div>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}