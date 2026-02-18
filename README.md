# CSE-3311 Team 6 Project

A React + TypeScript + Vite application with TailwindCSS and Radix UI components.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📦 Deployment

This project is configured for easy deployment to Vercel.

### Deploy to Vercel

#### Option 1: Using the deploy script (Easiest)

```bash
chmod +x deploy.sh
./deploy.sh
```

#### Option 2: Manual deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option 3: Via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Vercel will auto-detect settings and deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI
- **Routing**: React Router v7
- **Charts**: Recharts
- **Animations**: Motion, tw-animate-css

## 📁 Project Structure

```
CSE-3311-Team6/
├── src/
│   ├── app/
│   │   ├── components/    # Reusable components
│   │   ├── screens/       # Page components
│   │   ├── data/          # Mock data
│   │   ├── App.tsx        # Main app component
│   │   └── routes.js      # Route configuration
│   ├── styles/            # Global styles
│   └── main.tsx           # Entry point
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── vercel.json            # Vercel deployment config
└── package.json           # Dependencies

```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 📝 License

See [ATTRIBUTIONS.md](./ATTRIBUTIONS.md) for third-party licenses and attributions.
