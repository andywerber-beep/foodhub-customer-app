'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseData, Venue } from '@/hooks/useSupabaseData';
import { useGeolocation } from '@/hooks/useGeolocation';
import MapContainer from '@/components/map/MapContainer';
import FloatingPrompt from '@/components/map/FloatingPrompt';
import SlideUpCard from '@/components/venue/SlideUpCard';

export default function MainDashboardPage() {
  const router = useRouter();
  
  // Track which partner venue pin the user has currently opened
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  // 1. Pull active partner venues live out of our Supabase connection stream
  const { venues, loading, error } = useSupabaseData();

  // 2. Feed venues into the high-accuracy tracking hook
  const { userLocation, geoError, nearbyVenueIds } = useGeolocation(venues);

  // Close the drawer if the user taps somewhere neutral or moves away
  const handleCloseDrawer = () => {
    setSelectedVenue(null);
  };

  // Push user to the corresponding full-screen menu lookbook endpoint
  const handleViewMenu = (venueId: number) => {
    router.push(`/menu?id=${venueId}`);
  };

  const handleVenueMarkerClick = (venue: Venue) => {
    setSelectedVenue(venue);
  };

  // Handle data loading state gracefully
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '-apple-system, sans-serif',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ fontSize: '16px', color: '#666666' }}>Initializing FoodHub Maps...</div>
      </div>
    );
  }

  // Handle configuration or connection errors cleanly
  if (error || geoError) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: '-apple-system, sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4444', marginBottom: '8px' }}>
          Connection Offline
        </div>
        <div style={{ fontSize: '14px', color: '#666666' }}>{error || geoError}</div>
      </div>
    );
  }

  return (
    <main style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      
      {/* 1. Animated Overhead Proximity Banner */}
      <FloatingPrompt 
        isVisible={nearbyVenueIds.length > 0} 
        message="✨ Special Venue Deal Nearby!"
      />

      {/* 2. Interactive Google Map Layer */}
      <MapContainer 
        venues={venues} 
        onVenueClick={handleVenueMarkerClick} 
      />

      {/* 3. Snappy iOS-style Sliding Drawer Panel */}
      <SlideUpCard 
        venue={selectedVenue}
        onClose={handleCloseDrawer}
        onViewMenu={handleViewMenu}
      />

    </main>
  );
}