# BM TECH SOLUTIONS - Portfolio Website

A modern, responsive portfolio website showcasing professional graphics design and tech solutions. Built with HTML, CSS, and JavaScript, featuring an admin dashboard for easy content management.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Portfolio Showcase**: Display your work with categories and featured items
- **Admin Dashboard**: Secure admin panel to manage portfolio items
- **Contact Section**: Easy way for clients to reach out via social media
- **Services Section**: Highlight your offerings
- **About Section**: Tell your story
- **Authentication**: Secure login system powered by Supabase
- **Media Management**: Upload and manage images/videos for portfolio items

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS (via CDN)
- **Backend**: Supabase (Database, Authentication, Storage)
- **Icons**: SVG icons (replacing Lucide React)

## 📋 Prerequisites

Before you begin, ensure you have the following:

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A [Supabase](https://supabase.com) account (free tier works perfectly)
- (Optional) Node.js and npm for running a local development server

## 🔧 Installation

1. **Clone or download the repository**
   ```bash
   git clone <your-repo-url>
   cd "My Portfolio Site"
   ```

2. **Set up Supabase credentials**
   
   Open `js/config.js` and replace the placeholder values with your Supabase credentials:
   ```javascript
   window.SUPABASE_URL = 'your_supabase_project_url';
   window.SUPABASE_ANON_KEY = 'your_supabase_anon_key';
   ```
   
   To get these values:
   - Go to your Supabase project dashboard
   - Navigate to **Settings** → **API**
   - Copy the **Project URL** and **anon/public key**

3. **Set up the database**
   
   - Go to Supabase Dashboard → **SQL Editor**
   - Run the migration script from `supabase/migrations/20251209223611_create_portfolio_schema.sql`
   - This creates the necessary tables and security policies

4. **Set up storage bucket**
   
   - Go to Supabase Dashboard → **Storage**
   - Create a new bucket named `portfolio-media`
   - Make it **public** (so images/videos are accessible)

5. **Create admin user**
   
   - Go to Supabase Dashboard → **Authentication** → **Users**
   - Click "Add user" → "Create new user"
   - Enter your email and password
   - Check **Auto Confirm User**
   - Click "Create user"

## 🚀 Running the Project

### Option 1: Simple HTTP Server (Recommended)

If you have Node.js installed:

```bash
npm run dev
```

This will start a local server at `http://localhost:8080` and open it in your browser.

### Option 2: Python HTTP Server

If you have Python installed:

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

Then open `http://localhost:8080` in your browser.

### Option 3: Direct File Opening

You can also open `index.html` directly in your browser, but note that:
- Some features may not work due to CORS restrictions
- ES modules require a server to work properly
- Supabase API calls may be blocked

**Recommended**: Use a local server (Option 1 or 2)

## 📁 Project Structure

```
├── public/
│   ├── Icons/          # Social media icons
│   │   ├── in.png      # LinkedIn
│   │   ├── ig.png      # Instagram
│   │   ├── x.png       # X (Twitter)
│   │   ├── tk.png      # TikTok
│   │   └── wp.png      # WhatsApp
│   ├── logo.png        # Site logo
│   ├── fullpic.png     # About section image
│   └── hdshot.png      # About section headshot
├── js/
│   ├── config.js       # Supabase configuration
│   ├── supabase.js     # Supabase client setup
│   ├── auth.js         # Authentication logic
│   ├── portfolio.js    # Portfolio display and management
│   ├── admin.js        # Admin dashboard functionality
│   └── main.js         # Main application logic
├── supabase/
│   └── migrations/
│       └── 20251209223611_create_portfolio_schema.sql
├── index.html          # Main HTML file
├── styles.css          # Custom CSS styles
├── package.json        # Project configuration
└── README.md           # This file
```

## 🎨 Usage

### Accessing the Admin Dashboard

1. Start the development server (see above)
2. Click the "Admin" button in the footer or navigate to `#admin` in the URL
3. Log in with the credentials you created in Supabase

### Adding Portfolio Items

1. Log into the admin dashboard
2. Click "Add New Item"
3. Fill in the form:
   - **Title**: Name of your project/work
   - **Category**: Choose from dropdown (Flyers, Logos, Brochures, Banners, T-Shirts, Branding, Printing, Installations)
   - **Description**: Brief description of the work
   - **Upload File**: Click to upload an image or video (max 50MB)
   - **Feature on homepage**: Check if you want this item featured
4. Click "Upload Item"

### Managing Portfolio Items

- View all items in the admin dashboard
- Delete items using the trash icon
- Featured items will be highlighted on the homepage

For detailed setup instructions, see [PORTFOLIO_SETUP_GUIDE.md](./PORTFOLIO_SETUP_GUIDE.md)

## 🌐 Deployment

Since this is a static website, you can deploy it to any static hosting service:

### Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select your branch and folder (root)
4. Your site will be available at `https://yourusername.github.io/repository-name`

**Note**: Make sure to update `js/config.js` with your Supabase credentials before deploying, or use environment variables if your hosting platform supports them.

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository on [Netlify](https://netlify.com)
3. Build command: Leave empty (no build needed)
4. Publish directory: `/` (root)
5. Deploy!

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Framework preset: Other
4. Deploy!

### Other Platforms

This static website can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Firebase Hosting
- Any other static hosting service

## 🔒 Security Notes

- **Never commit your `js/config.js` file with real credentials to public repositories**
- Add `js/config.js` to `.gitignore` if it contains sensitive data
- Consider using environment variables or a server-side configuration for production
- Supabase handles authentication and database security
- Admin routes are protected by authentication

## 📝 Available Scripts

- `npm run dev` - Start development server and open in browser
- `npm run serve` - Start development server without opening browser

## 🐛 Troubleshooting

### Supabase connection issues

- Make sure `js/config.js` has the correct Supabase URL and key
- Check browser console for error messages
- Verify your Supabase project is active

### Images not loading

- Check that the storage bucket `portfolio-media` is set to public
- Verify file paths in the HTML are correct
- Check browser console for 404 errors

### Admin login not working

- Make sure you created the user in Supabase Authentication
- Verify "Auto Confirm User" was checked when creating the user
- Check browser console for authentication errors

### ES Module errors

- Make sure you're running the site through a local server (not opening file directly)
- Check that all script tags have `type="module"` where needed
- Verify your browser supports ES6 modules

## 🤝 Contributing

This is a personal portfolio project. If you'd like to suggest improvements or report issues, please open an issue on GitHub.

## 📄 License

This project is private and proprietary. All rights reserved.

## 👤 Author

**BM TECH SOLUTIONS**

Professional Graphics Design & Tech Solutions

## 🙏 Acknowledgments

- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons are custom SVG implementations

---

For questions or support, please contact through the website's contact form.
