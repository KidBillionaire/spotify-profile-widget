# 🎵 Quick Setup Guide

## Step 1: Get Your Client Secret

1. Go to: https://developer.spotify.com/dashboard
2. Click on **"Flashing Lights"** app
3. Click **"Settings"**
4. Click **"Show Client Secret"**
5. Copy it

## Step 2: Run the Credential Script

```bash
cd /tmp/spotify-profile-widget
node get-credentials.js
```

This will:

- Ask for your Client Secret
- Open a browser to authorize
- Automatically get your refresh token
- Print all credentials you need!

## Step 3: Deploy to Vercel

```bash
# Install Vercel CLI (if you don't have it)
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

During deployment, Vercel will ask for environment variables. Add:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

(Use the values from Step 2)

## Step 4: Add to Your GitHub Profile

After deployment, you'll get a URL like: `https://your-project.vercel.app`

Add this to your GitHub profile README:

```markdown
## 🎵 Currently Vibing To

![Spotify Now Playing](https://your-project.vercel.app/api/now-playing)
```

Done! 🔥
