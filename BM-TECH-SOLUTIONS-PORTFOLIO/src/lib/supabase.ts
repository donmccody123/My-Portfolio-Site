import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  media_url: string;
  media_type: 'image' | 'video';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};
