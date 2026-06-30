'use client';

import { createClient } from '@supabase/supabase-base-js'; // adjust import string to match your exact package if needed
import { useEffect, useState } from 'react';

// Initialize Supabase configuration client engine layout
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Venue {
  id: number;
  name: string;
  cuisine_type: string;
  status: string;
  town: string;
  postcode: string;
  address1: string;
  latitude?: number;
  longitude?: number;
}

export function useSupabaseData() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getActivePartners() {
      try {
        setLoading(true);
        // Point directly to your active 'partners' table instead of 'venues'
        const { data, error: fetchError } = await supabase
          .from('partners') 
          .select('id, name, cuisine_type, status, town, postcode, address1');

        if (fetchError) throw fetchError;

        // Map data safely into state array frame
        setVenues(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to populate database metrics');
      } finally {
        setLoading(false);
      }
    }

    getActivePartners();
  }, []);

  return { venues, loading, error };
}