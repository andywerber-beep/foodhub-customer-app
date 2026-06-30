'use client';

import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Venue } from '@/hooks/useSupabaseData'; // Importing the official master type

interface MapContainerProps {
  venues: Venue[];
  onVenueClick?: (venue: Venue) => void;
}

// Center position coordinates set squarely on central Brighton
const BRIGHTON_CENTER = { lat: 50.8225, lng: -0.1372 };
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function MapContainer({ venues, onVenueClick }: MapContainerProps) {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div style={{ padding: '20px', color: '#ff4444', textAlign: 'center' }}>
        <strong>Missing Config:</strong> Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <Map
          defaultCenter={BRIGHTON_CENTER}
          defaultZoom={14}
          gestureHandling="cooperative"
          disableDefaultUI={true}
          mapId="foodhub_map_layer"
        >
          {venues.map((venue) => {
            // Check if coordinates exist on the object before drawing pins
            // (Cast to any temporarily if latitude/longitude aren't strictly typed in the schema yet)
            const lat = (venue as any).latitude;
            const lng = (venue as any).longitude;

            if (!lat || !lng) return null;

            return (
              <AdvancedMarker
                key={venue.id}
                position={{ lat: Number(lat), lng: Number(lng) }}
                onClick={() => onVenueClick?.(venue)}
              >
                <Pin 
                  background={'#111111'} 
                  borderColor={'#ffffff'} 
                  glyphColor={'#ffffff'}
                />
              </AdvancedMarker>
            );
          })}
        </Map>
      </div>
    </APIProvider>
  );
}