# Deployment Guide

## Netlify Deployment (Free)

This project is configured for easy deployment on Netlify's free tier as a static site with serverless functions.

### Prerequisites
- GitHub repository with your code
- Netlify account (free at netlify.com)

### Deployment Steps

#### Option 1: GitHub Integration (Recommended)
1. Go to [Netlify](https://netlify.com) and sign up/login
2. Click "New site from Git"
3. Connect your GitHub account
4. Select your repository: `rental-message-generator`
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
   - **Base directory**: (leave empty)
6. Click "Deploy site"

#### Option 2: Manual Deploy
1. Build the project locally:
   ```bash
   npm run build
   ```
2. Go to Netlify and drag/drop the `dist/public` folder

### Configuration Files

The following files are configured for Netlify deployment:

- **netlify.toml**: Main configuration file
- **vite.config.netlify.ts**: Vite build configuration for Netlify
- **package-netlify.json**: Simplified dependencies for static deployment
- **netlify/functions/api.js**: Serverless function for API endpoints

### Environment Variables

Since this is now a client-side application, all data processing happens in the browser. No server-side environment variables are needed.

### Features Available in Netlify Deployment

✅ **Client-side data processing**
✅ **Message generation with templates**
✅ **Payment information configuration**
✅ **Edit mode for customer data**
✅ **Search and filtering**
✅ **Completion tracking**
✅ **Copy to clipboard functionality**

### Post-Deployment

After deployment:
1. Your site will be available at a Netlify URL (e.g., `https://amazing-site-name.netlify.app`)
2. You can configure a custom domain in Netlify settings
3. HTTPS is automatically enabled
4. The site will auto-deploy when you push to your GitHub repository

### Performance Optimizations

The Netlify deployment includes:
- Automatic compression
- CDN distribution
- Instant cache invalidation
- Form handling (if needed in future)

### Troubleshooting

**Build fails?**
- Check that all dependencies are in package.json
- Ensure Node.js version is compatible (using Node 20)

**Site loads but features don't work?**
- Check browser console for errors
- Verify all client-side functionality works locally first

**Need dynamic features?**
- Consider upgrading to Netlify Pro for more serverless function time
- Or migrate to platforms like Vercel or Railway for full-stack apps

### Cost
- **Free tier includes**:
  - 100GB bandwidth/month
  - 125,000+ serverless function invocations
  - Automatic SSL certificate
  - Custom domain support