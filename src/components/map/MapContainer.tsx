'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Venue } from '@/hooks/useSupabaseData';
import SlideUpCard from '../venue/SlideUpCard';
import FloatingPrompt from './FloatingPrompt';

interface MapContainerProps {
  venues: Venue[];
  userLocation: { latitude: number; longitude: number } | null;
  proximityVenue: Venue | null;
  onClearPrompt: () => void;
}

export default function MapContainer({
  venues,
  userLocation,
  proximityVenue,
  onClearPrompt,
}: MapContainerProps) {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const router = useRouter();

  const fallbackCenter = { lat: 50.8136, lng: -0.3704 };
  
  const mapCenter = userLocation 
    ? { lat: userLocation.latitude, lng: userLocation.longitude } 
    : fallbackCenter;

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        
        <Map
          center={mapCenter}
          defaultZoom={14}
          gestureHandling="greedy"
          zoomControl={true}
          mapTypeControl={false}
          scaleControl={true}
          streetViewControl={false}
          rotateControl={false}
          fullscreenControl={false}
        >
          {userLocation && (
            <Marker
              position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
              title="Your Location"
              options={{
                icon: {
                  path: 0,
                  scale: 8,
                  fillColor: '#0066FF',
                  fillOpacity: 1,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 2,
                },
              }}
            />
          )}

          {venues.map((venue) => {
            if (!venue.latitude || !venue.longitude) return null;

            return (
              <Marker
                key={venue.id}
                position={{ lat: venue.latitude, lng: venue.longitude }}
                title={venue.name}
                onClick={() => setSelectedVenue(venue)}
                options={{
                  icon: {
                    path: 0,
                    scale: 10,
                    fillColor: '#111111',
                    fillOpacity: 1,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 2,
                  },
                }}
              />
            );
          })}
        </Map>

        {proximityVenue && (
          <FloatingPrompt 
            venue={proximityVenue} 
            onClose={onClearPrompt} 
          />
        )}

        {selectedVenue && (
          <SlideUpCard 
            venue={selectedVenue} 
            onClose={() => setSelectedVenue(null)} 
            onViewMenu={(id) => router.push(`/menu?id=${id}`)}
          />
        )}

      </div>
    </APIProvider>
  );
}