#!/bin/bash

echo "🎵 Spotify Widget Setup for GitHub Profile"
echo "==========================================="
echo ""

CLIENT_ID="46c23edd187d4933bc56983d18bfd382"
REDIRECT_URI="http://localhost:5000/callback"

echo "Step 1: Get your Spotify Client Secret"
echo "1. Go to: https://developer.spotify.com/dashboard/46c23edd187d4933bc56983d18bfd382/settings"
echo "2. Click 'Show Client Secret'"
echo "3. Copy it"
echo ""
read -p "Paste your Client Secret here: " CLIENT_SECRET
echo ""

echo "Step 2: Authorize the app"
echo "Opening browser to authorize..."
AUTH_URL="https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=user-read-currently-playing%20user-read-playback-state"

echo ""
echo "Visit this URL to authorize:"
echo "$AUTH_URL"
echo ""

# Try to open the URL
if command -v open &> /dev/null; then
    open "$AUTH_URL"
elif command -v xdg-open &> /dev/null; then
    xdg-open "$AUTH_URL"
fi

echo "After authorizing, you'll be redirected to localhost."
echo "The page won't load, but copy the 'code' parameter from the URL"
echo ""
read -p "Paste the authorization code here: " AUTH_CODE
echo ""

echo "Step 3: Getting refresh token..."

RESPONSE=$(curl -s -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&code=${AUTH_CODE}&redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}")

REFRESH_TOKEN=$(echo $RESPONSE | grep -o '"refresh_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$REFRESH_TOKEN" ]; then
    echo "❌ Error getting refresh token. Response:"
    echo $RESPONSE
    exit 1
fi

echo "✅ Success! Got your refresh token"
echo ""
echo "==================== YOUR CREDENTIALS ===================="
echo "SPOTIFY_CLIENT_ID=${CLIENT_ID}"
echo "SPOTIFY_CLIENT_SECRET=${CLIENT_SECRET}"
echo "SPOTIFY_REFRESH_TOKEN=${REFRESH_TOKEN}"
echo "=========================================================="
echo ""
echo "Next steps:"
echo "1. Deploy to Vercel: vercel --prod"
echo "2. Add these environment variables to your Vercel project"
echo "3. Add the widget to your GitHub profile README"
echo ""
