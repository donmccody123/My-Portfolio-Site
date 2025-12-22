-- Add media_gallery column to store multiple media entries per portfolio item
alter table public.portfolio_items
  add column if not exists media_gallery jsonb default '[]'::jsonb;
