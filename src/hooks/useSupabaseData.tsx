'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// Initialize Supabase configuration client engine layout
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Offer {
  id: number;
  title: string;
  discount_price: number;
  description: string;
  image_url?: string;
  proximity_ping: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Venue {
  id: string;
  name: string;
  cuisine_type: string;
  status: string;
  town: string;
  postcode: string;
  address1: string;
  website_url?: string;
  latitude?: number;
  longitude?: number;
  offers?: Offer | Offer[] | null; // Captures real-time joined campaign data
}

export function useSupabaseData() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getActivePartnersWithOffers() {
      try {
        setLoading(true);

        // Fetch active venues and perform a relational join to bring their running flash offers
        const { data, error: fetchError } = await supabase
          .from('partners') 
          .select(`
            id, 
            name, 
            cuisine_type, 
            status, 
            town, 
            postcode, 
            address1,
            website_url,
            offers (
              id,
              title,
              discount_price,
              description,
              image_url,
              proximity_ping,
              is_active,
              created_at
            )
          `)
          .eq('status', 'active'); // Only pull partners currently launched live into the ecosystem

        if (fetchError) throw fetchError;

        setVenues(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to populate ecosystem database metrics.');
      } finally {
        setLoading(false);
      }
    }

    getActivePartnersWithOffers();
  }, []);

  return { venues, loading, error };
}