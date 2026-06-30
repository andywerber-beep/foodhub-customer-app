'use client';

import React from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useGeolocation } from '@/hooks/useGeolocation';
import MapContainer from '@/components/map/MapContainer';

export default function Home() {
  // 1. Stream live venue database profiles straight from the partners schema
  const { venues, loading: dataLoading, error: dataError } = useSupabaseData();

  // 2. Wake up the mobile device hardware coordinate tracking engine
  const { userLocation, proximityVenue, clearProximityAlert } = useGeolocation(venues);

  if (dataLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', fontFamily: '-apple-system, sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#111111', letterSpacing: '-0.01em' }}>Opening Lookbook Radar...</div>
          <div style={{ fontSize: '13px', color: '#888888' }}>Syncing secure partner endpoints</div>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', padding: '24px', textAlign: 'center', fontFamily: '-apple-system, sans-serif' }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: '#FF3B30' }}>Radar Sync Offline</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#666666' }}>{dataError}</p>
        </div>
      </div>
    );
  }

  return (
    <main style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
      
      {/* Dynamic Map Canvas Layer (Handles map pins, lookbook drawer, and proximity alerts internally) */}
      <MapContainer 
        venues={venues}
        userLocation={userLocation}
        proximityVenue={proximityVenue}
        onClearPrompt={clearProximityAlert}
      />

    </main>
  );
}