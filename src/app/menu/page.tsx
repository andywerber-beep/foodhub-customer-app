'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase, Venue } from '@/hooks/useSupabaseData';

interface MenuItem {
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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!venueId) return;

    async function fetchVenueMenuData() {
      try {
        setLoading(true);

        const { data: venueData } = await supabase
          .from('partners')
          .select('id, name, cuisine_type, status, town, postcode, address1')
          .eq('id', venueId)
          .single();

        if (venueData) setVenue(venueData);

        const { data: menuData } = await supabase
          .from('menu_items')
          .select('id, name, description, price, image_url')
          .eq('venue_id', venueId);

        if (menuData) setMenuItems(menuData);
      } catch (err) {
        console.error('Error fetching lookbook data details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchVenueMenuData();
  }, [venueId]);

  const handleNFCTapPurchase = (item: MenuItem) => {
    const commissionAmount = item.price * 0.10; 
    alert(`NFC Tap Active: Hold your mobile device near the vendor terminal to buy ${item.name} for £${item.price.toFixed(2)}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', fontFamily: '-apple-system, sans-serif' }}>
        <div style={{ color: '#666666' }}>Loading Exclusive Offers...</div>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px 8px' }}>
          ←
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#111111', letterSpacing: '-0.02em' }}>{venue.name}</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#666666', textTransform: 'capitalize' }}>{venue.cuisine_type}</p>
        </div>
      </div>

      <hr style={{ border: 'none', height: '1px', backgroundColor: '#eaeaea', marginBottom: '24px' }} />

      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111111', marginBottom: '16px' }}>Signature Items & Experience Deals</h3>

      {menuItems.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#888', fontSize: '14px' }}>
          No exclusive items posted for this venue yet. Check back soon!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {menuItems.map((item) => (
            <div key={item.id} style={{ border: '1px solid #eaeaea', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between',  alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: '#111111' }}>{item.name}</h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#666666', lineHeight: '1.4' }}>{item.description}</p>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#111111' }}>£{item.price.toFixed(2)}</span>
              </div>
              <button onClick={() => handleNFCTapPurchase(item)} style={{ backgroundColor: '#111111', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                NFC Tap Pay
              </button>
            </div>
          ))}
        </div>
      )}
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