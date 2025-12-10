/*
  # Portfolio Website Database Schema

  1. New Tables
    - `portfolio_items`
      - `id` (uuid, primary key) - Unique identifier for each portfolio item
      - `title` (text) - Title of the work
      - `description` (text) - Description of the work
      - `category` (text) - Category (flyers, logos, brochures, banners, t-shirts, branding, printing, installations)
      - `media_url` (text) - URL to the image or video in Supabase storage
      - `media_type` (text) - Type of media (image or video)
      - `is_featured` (boolean) - Whether to feature on homepage
      - `created_at` (timestamptz) - When the item was created
      - `updated_at` (timestamptz) - When the item was last updated

  2. Security
    - Enable RLS on `portfolio_items` table
    - Add policy for public read access (anyone can view portfolio)
    - Add policy for authenticated admin insert/update/delete
    
  3. Storage
    - Create storage bucket for portfolio media
*/

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL,
  media_url text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view portfolio items
CREATE POLICY "Anyone can view portfolio items"
  ON portfolio_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Authenticated users can insert portfolio items
CREATE POLICY "Authenticated users can insert portfolio items"
  ON portfolio_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update portfolio items
CREATE POLICY "Authenticated users can update portfolio items"
  ON portfolio_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete portfolio items
CREATE POLICY "Authenticated users can delete portfolio items"
  ON portfolio_items FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for portfolio media
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for portfolio-media bucket
CREATE POLICY "Anyone can view portfolio media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated users can upload portfolio media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated users can update portfolio media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-media')
  WITH CHECK (bucket_id = 'portfolio-media');

CREATE POLICY "Authenticated users can delete portfolio media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-media');