import { useEffect, useState } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
}

// Haversine formula to compute absolute physical distance in meters between two global coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export function useGeolocation(partnerVenues: any[], proximityThresholdMeters = 400) {
  const [location, setLocation] = useState<GeolocationState>({ coordinates: null, error: null });
  const [nearbyVenueIds, setNearbyVenueIds] = useState<number[]>([]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: 'Geolocation is not supported by your browser.' }));
      return;
    }

    // High accuracy mode enabled to handle premium pavement-level tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        setLocation({
          coordinates: { latitude: userLat, longitude: userLon },
          error: null,
        });

        // Scan through all active partner venues loaded from Supabase
        const triggeredIds: number[] = [];
        partnerVenues.forEach((venue) => {
          if (venue.latitude && venue.longitude) {
            const distance = calculateDistance(userLat, userLon, venue.latitude, venue.longitude);
            
            // Check if user crossed inside our walking radius target
            if (distance <= proximityThresholdMeters) {
              triggeredIds.push(venue.id);
            }
          }
        });

        setNearbyVenueIds(triggeredIds);
      },
      (err) => {
        setLocation((prev) => ({ ...prev, error: err.message }));
      },
      {
        enableHighAccuracy: true, 
        timeout: 15000,
        maximumAge: 0, // Force fresh coordinates instead of reading device cache
      }
    );

    // Unmount and disconnect the GPS sensor stream when the user closes the application
    return () => navigator.geolocation.clearWatch(watchId);
  }, [partnerVenues, proximityThresholdMeters]);

  return { userLocation: location.coordinates, geoError: location.error, nearbyVenueIds };
}