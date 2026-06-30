import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize the secure client with our verified local Next environment keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Venue {
  id: number;
  name: string;
  cuisine_type: string; // Enforcing your exact spelling parameter
  status: string;
  town: string;
  postcode: string;
  address1: string;
  address2?: string;
}

export function useSupabaseData() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActiveVenues() {
      try {
        setLoading(true);
        
        // Querying the venues table explicitly for live partner venues
        const { data, error: supabaseError } = await supabase
          .from('venues')
          .select('id, name, cuisine_type, status, town, postcode, address1, address2')
          .eq('status', 'active'); // Filtering out onboarding/pending items completely

        if (supabaseError) throw supabaseError;

        setVenues(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to pull partner venue layers.');
      } finally {
        setLoading(false);
      }
    }

    if (supabaseUrl && supabaseAnonKey) {
      fetchActiveVenues();
    }
  }, []);

  return { venues, loading, error };
}