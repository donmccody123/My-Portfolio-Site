# How to Add Portfolio Items to Your Site

Your portfolio site uses **Supabase** (a backend-as-a-service) to store and manage your portfolio items. Follow these steps to set it up and start adding your work.

## Step 1: Set Up Supabase

1. **Create a Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up for a free account (free tier is perfect for portfolios)

2. **Create a New Project**
   - Click "New Project"
   - Choose an organization (or create one)
   - Enter project details:
     - **Name**: BM TECH SOLUTIONS Portfolio (or any name you prefer)
     - **Database Password**: Create a strong password (save it!)
     - **Region**: Choose the closest region to you
   - Click "Create new project" (takes 1-2 minutes)

3. **Get Your Project Credentials**
   - Once your project is ready, go to **Settings** → **API**
   - Copy these values:
     - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - **anon/public key** (long string starting with `eyJ...`)

## Step 2: Configure Environment Variables

1. **Create a `.env` file** in your project root (same folder as `package.json`)

2. **Add your Supabase credentials**:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

   Example:
   ```
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Save the file** and restart your dev server if it's running

## Step 3: Set Up the Database

1. **Go to Supabase Dashboard** → **SQL Editor**

2. **Run the migration script**:
   - Click "New query"
   - Copy and paste the contents of `supabase/migrations/20251209223611_create_portfolio_schema.sql`
   - Click "Run" to execute the script
   - This creates the `portfolio_items` table and sets up security policies

## Step 4: Set Up Storage Bucket

1. **Go to Supabase Dashboard** → **Storage**

2. **Create a new bucket**:
   - Click "New bucket"
   - **Name**: `portfolio-media`
   - **Public bucket**: ✅ Check this (so images/videos are publicly accessible)
   - Click "Create bucket"

3. **Set up bucket policies** (if needed):
   - Go to **Storage** → **Policies** → `portfolio-media`
   - Make sure there's a policy allowing public read access

## Step 5: Create Your Admin Account

1. **Go to Supabase Dashboard** → **Authentication** → **Users**

2. **Create a new user**:
   - Click "Add user" → "Create new user"
   - Enter:
     - **Email**: your-email@example.com (use your real email)
     - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Check this
   - Click "Create user"

3. **Save your login credentials** - you'll use these to access the admin dashboard

## Step 6: Access the Admin Dashboard

1. **Start your dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to the admin panel**:
   - Option 1: Click the "Admin" button in the footer of your site
   - Option 2: Go to `http://localhost:5173/admin` in your browser

3. **Log in** with the email and password you created in Step 5

## Step 7: Add Portfolio Items

Once logged into the admin dashboard:

1. **Click "Add New Item"** button

2. **Fill in the form**:
   - **Title**: Name of your project/work
   - **Category**: Choose from dropdown (Flyers, Logos, Brochures, etc.)
   - **Description**: Brief description of the work
   - **Upload File**: Click to upload an image or video
     - Supported: Images (JPG, PNG, etc.) and Videos (MP4, etc.)
     - Max size: 50MB
   - **Feature on homepage**: Check if you want this item featured

3. **Click "Upload Item"**

4. **Your portfolio item will appear**:
   - On the Portfolio page of your site
   - In the admin dashboard for management
   - Can be deleted using the trash icon

## Tips

- **Image Recommendations**: 
  - Use high-quality images (at least 1200px wide)
  - JPG for photos, PNG for graphics with transparency
  - Optimize images before uploading for faster loading

- **Categories Available**:
  - Flyers
  - Logos
  - Brochures
  - Banners
  - T-Shirts
  - Branding
  - Printing
  - Installations

- **Featured Items**: Items marked as "featured" will be highlighted on your homepage

- **Managing Items**: You can view, delete, and manage all items from the admin dashboard

## Troubleshooting

**Can't log in?**
- Make sure you created the user in Supabase Authentication
- Check that "Auto Confirm User" was checked when creating the user

**Images not showing?**
- Verify the storage bucket is set to "Public"
- Check that the file uploaded successfully in Supabase Storage

**Getting errors?**
- Make sure your `.env` file has the correct Supabase URL and key
- Restart your dev server after creating/updating `.env`
- Check the browser console for specific error messages

## Need Help?

If you encounter any issues:
1. Check the browser console (F12) for error messages
2. Verify all Supabase settings are correct
3. Make sure the database migration ran successfully

