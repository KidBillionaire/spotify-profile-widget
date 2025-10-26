# Spotify Now Playing Widget for GitHub Profile

Custom Spotify widget that shows what you're currently listening to on your GitHub profile.

## 🚀 Quick Setup

### Step 1: Get Spotify Credentials

You already have a Spotify app "Flashing Lights"!

**Client ID:** `46c23edd187d4933bc56983d18bfd382`

**Get Client Secret:**

1. Go to https://developer.spotify.com/dashboard
2. Click on "Flashing Lights"
3. Click "Show Client Secret"
4. Copy it

### Step 2: Get Refresh Token

Run this command (replace with your Client Secret):

```bash
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=46c23edd187d4933bc56983d18bfd382&client_secret=YOUR_CLIENT_SECRET"
```

Actually, we need user authorization. Follow these steps:

1. Visit this URL (replace YOUR_CLIENT_SECRET):

```
https://accounts.spotify.com/authorize?client_id=46c23edd187d4933bc56983d18bfd382&response_type=code&redirect_uri=http://localhost:5000/callback&scope=user-read-currently-playing
```

2. Authorize the app
3. You'll be redirected to `http://localhost:5000/callback?code=XXXX`
4. Copy the `code` parameter from the URL

5. Get your refresh token:

```bash
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&code=YOUR_CODE_HERE&redirect_uri=http://localhost:5000/callback&client_id=46c23edd187d4933bc56983d18bfd382&client_secret=YOUR_CLIENT_SECRET"
```

6. Save the `refresh_token` from the response!

### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd /tmp/spotify-profile-widget
vercel --prod
```

### Step 4: Add Environment Variables on Vercel

Go to your Vercel dashboard and add these environment variables:

```
SPOTIFY_CLIENT_ID=46c23edd187d4933bc56983d18bfd382
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
```

### Step 5: Add to GitHub Profile

Once deployed, you'll get a URL like: `https://your-project.vercel.app/api/now-playing`

Add this to your README:

```markdown
## 🎵 Currently Vibing To

![Spotify Now Playing](https://your-project.vercel.app/api/now-playing)
```

## 🎨 How It Works

- Fetches your currently playing track from Spotify API
- Generates a custom SVG with album art, track name, and artist
- Updates every 60 seconds
- Shows "Not Playing" when nothing is playing

## 🔒 Security

- Uses Spotify OAuth refresh tokens (never expires)
- Environment variables secured on Vercel
- No sensitive data exposed in the widget

---

**Pro tip:** The widget caches for 60 seconds to avoid hitting Spotify rate limits.
