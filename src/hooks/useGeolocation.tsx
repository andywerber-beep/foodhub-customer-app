'use client';

import { useState, useEffect } from 'react';
import { Venue } from './useSupabaseData';

export function useGeolocation(venues: Venue[]) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [proximityVenue, setProximityVenue] = useState<Venue | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        // Proximity calculation loop (approx. 500 meters check ring frame)
        const nearby = venues.find((venue) => {
          if (!venue.latitude || !venue.longitude) return false;
          
          const ky = 40000 / 360;
          const kx = Math.cos((Math.PI * latitude) / 180) * ky;
          const dx = Math.abs(venue.longitude - longitude) * kx;
          const dy = Math.abs(venue.latitude - latitude) * ky;
          return Math.sqrt(dx * dx + dy * dy) <= 0.5;
        });

        if (nearby && nearby.status === 'active') {
          setProximityVenue(nearby);
        }
      },
      (error) => console.error('Error tracking device coordinates:', error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [venues]);

  const clearProximityAlert = () => {
    setProximityVenue(null);
  };

  return {
    userLocation,
    proximityVenue,
    clearProximityAlert,
  };
}