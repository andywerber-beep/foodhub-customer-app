'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
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
  const [hoveredVenueId, setHoveredVenueId] = useState<string | null>(null);
  const router = useRouter();

  if (!userLocation) {
    return (
      <div style={{ display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', fontFamily: '-apple-system, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #eaeaea', borderTopColor: '#f06262', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
          <div style={{ color: '#666666', fontSize: '14px', fontWeight: 500 }}>Locating your phone...</div>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      </div>
    );
  }

  const mapInitialCenter = { lat: userLocation.latitude, lng: userLocation.longitude };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        
        <style>{`
          @keyframes greenPulse {
            0% {
              transform: scale(0.6);
              opacity: 1;
            }
            100% {
              transform: scale(2.4);
              opacity: 0;
            }
          }
          .pulse-ring {
            position: absolute;
            width: 32px;
            height: 32px;
            background-color: rgba(74, 222, 128, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            animation: greenPulse 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
          }
          .venue-map-label {
            background-color: #ffffff;
            color: #111111;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.12);
            border: 1px solid #eaeaea;
            letter-spacing: -0.01em;
          }
        `}</style>

        <Map
          defaultCenter={mapInitialCenter}
          defaultZoom={15}
          gestureHandling="greedy"
          zoomControl={true}
          mapTypeControl={false}
          scaleControl={true}
          streetViewControl={false}
          rotateControl={false}
          fullscreenControl={false}
          mapId="LUNX_MAP_PLATFORM_PROD"
        >
          <AdvancedMarker position={mapInitialCenter} title="Your Location">
            <div style={{ width: '16px', height: '16px', backgroundColor: '#0066FF', borderRadius: '50%', border: '3px solid #ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
          </AdvancedMarker>

          {venues.map((venue) => {
            if (!venue.latitude || !venue.longitude) return null;

            // Direct mapping connection: check if the offers array exists and has entries
            const hasActiveOffer = Array.isArray(venue.offers) 
              ? venue.offers.length > 0 
              : !!venue.offers;
              
            const isHovered = hoveredVenueId === venue.id;
            const shouldPulse = hasActiveOffer && !isHovered;

            return (
              <AdvancedMarker
                key={venue.id}
                position={{ lat: venue.latitude, lng: venue.longitude }}
                title={venue.name}
                onClick={() => setSelectedVenue(venue)}
              >
                <div 
                  onMouseEnter={() => {
                    setHoveredVenueId(venue.id);
                    setSelectedVenue(venue);
                  }}
                  onMouseLeave={() => setHoveredVenueId(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', position: 'relative' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '32px', height: '32px' }}>
                    {shouldPulse && <div className="pulse-ring" />}
                    <Pin 
                      background={'#f06262'} 
                      borderColor={'#ffffff'} 
                      glyphColor={'#ffffff'}
                      scale={1.1}
                    />
                  </div>

                  <div className="venue-map-label">
                    {venue.name}
                  </div>
                </div>
              </AdvancedMarker>
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