// Supabase client configuration
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Get environment variables from window object (set in config.js)
const supabaseUrl = window.SUPABASE_URL || '';
const supabaseAnonKey = window.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_ANON_KEY in config.js');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const PortfolioItem = {
  id: '',
  title: '',
  description: '',
  category: '',
  media_url: '',
  media_type: 'image',
  is_featured: false,
  created_at: '',
  updated_at: ''
};

