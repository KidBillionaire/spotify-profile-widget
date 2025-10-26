# ⚡ Quick Start (When You Come Back)

## What This Is
Custom Spotify "Now Playing" widget for your GitHub profile. Shows album art + current song in real-time.

## Your Credentials (Already Have)
- **Client ID**: `46c23edd187d4933bc56983d18bfd382`
- **Client Secret**: `22ad07e492bd40e5902092cfbee0a0b1`
- **User ID**: `22ad07e492bd40e5902092cfbee0a0b1`
- **Redirect URI**: `http://localhost:5000/callback`

## 🚀 Fast Setup (3 Steps)

### 1. Get Refresh Token
```bash
cd /tmp/spotify-profile-widget
node get-credentials.js
```

Or manually:
1. Visit: https://accounts.spotify.com/authorize?client_id=46c23edd187d4933bc56983d18bfd382&response_type=code&redirect_uri=http://localhost:5000/callback&scope=user-read-currently-playing%20user-read-playback-state
2. Log in and authorize
3. Copy the URL after redirect (starts with `http://localhost:5000/callback?code=...`)
4. Extract the `code` parameter
5. Run this:
```bash
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&code=YOUR_CODE_HERE&redirect_uri=http://localhost:5000/callback&client_id=46c23edd187d4933bc56983d18bfd382&client_secret=22ad07e492bd40e5902092cfbee0a0b1"
```

### 2. Deploy to Vercel
```bash
npm install -g vercel  # if needed
vercel login
vercel --prod
```

Add these environment variables when prompted:
```
SPOTIFY_CLIENT_ID=46c23edd187d4933bc56983d18bfd382
SPOTIFY_CLIENT_SECRET=22ad07e492bd40e5902092cfbee0a0b1
SPOTIFY_REFRESH_TOKEN=<from step 1>
```

### 3. Add to GitHub Profile
After deployment, add to your GitHub profile README:

```markdown
## 🎵 Currently Vibing To

![Spotify](https://YOUR-PROJECT.vercel.app/api/now-playing)
```

## Files
- **`api/now-playing.js`** - Main serverless function
- **`get-credentials.js`** - Automated credential getter
- **`get-refresh-token.sh`** - Manual bash script
- **`SETUP.md`** - Detailed setup guide
- **`README.md`** - Full documentation

## Already on GitHub
https://github.com/KidBillionaire/spotify-profile-widget

## Current Profile Status
✅ GitHub profile is already sick without Spotify
- GitHub stats ✅
- Tech stack showcase ✅
- OutreachOS featured ✅  
- Contribution streak ✅
- Shipping methodology ✅

Spotify widget is **nice to have**, not required! Your profile already looks 🔥

