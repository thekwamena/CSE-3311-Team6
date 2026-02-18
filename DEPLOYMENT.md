# Vercel Deployment Guide

This project is configured and ready to deploy to Vercel.

## Quick Deploy

### Option 1: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy to Vercel:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (unless you already created one)
   - What's your project's name? (Press enter or give it a name)
   - In which directory is your code located? **./** (press enter)
   
4. For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New Project"
4. Import your Git repository
5. Vercel will auto-detect the framework (Vite) and configure settings
6. Click "Deploy"

## Configuration Files

- **vercel.json** - Configures Vercel deployment settings and SPA routing
- **.gitignore** - Excludes build artifacts and dependencies from Git

## Build Settings (Auto-configured)

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## Environment Variables

If you need environment variables:
1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add your variables (they should start with `VITE_` to be accessible in the app)

## Custom Domain

After deployment, you can add a custom domain:
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain

## Automatic Deployments

Once connected to Git:
- Every push to `main` branch = Production deployment
- Every push to other branches = Preview deployment
