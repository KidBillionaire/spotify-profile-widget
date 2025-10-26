#!/bin/bash

CLIENT_ID="46c23edd187d4933bc56983d18bfd382"
CLIENT_SECRET="22ad07e492bd40e5902092cfbee0a0b1"
REDIRECT_URI="http://localhost:8888/callback"

echo "🎵 Getting Spotify Refresh Token..."
echo ""

# Authorization URL
AUTH_URL="https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=user-read-currently-playing%20user-read-playback-state"

echo "Step 1: Opening browser for authorization..."
echo ""
echo "If browser doesn't open, visit:"
echo "$AUTH_URL"
echo ""

# Open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "$AUTH_URL"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "$AUTH_URL"
fi

# Start local server to catch callback
echo "Waiting for authorization..."
echo "After you authorize, paste the full redirect URL here:"
echo "(It will look like: http://localhost:8888/callback?code=XXXXX)"
echo ""
read -p "Paste the URL: " CALLBACK_URL

# Extract code from URL
CODE=$(echo "$CALLBACK_URL" | grep -oP 'code=\K[^&]+')

if [ -z "$CODE" ]; then
    echo "❌ Could not extract code from URL"
    exit 1
fi

echo ""
echo "Getting refresh token..."

# Exchange code for tokens
RESPONSE=$(curl -s -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&code=${CODE}&redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}")

REFRESH_TOKEN=$(echo $RESPONSE | grep -oP '"refresh_token":"\K[^"]+')

if [ -z "$REFRESH_TOKEN" ]; then
    echo "❌ Error getting refresh token. Response:"
    echo $RESPONSE
    exit 1
fi

echo ""
echo "✅ SUCCESS! Here are your credentials:"
echo ""
echo "==================== COPY THESE ===================="
echo "SPOTIFY_CLIENT_ID=${CLIENT_ID}"
echo "SPOTIFY_CLIENT_SECRET=${CLIENT_SECRET}"
echo "SPOTIFY_REFRESH_TOKEN=${REFRESH_TOKEN}"
echo "===================================================="
echo ""
echo "Save these for Vercel deployment!"
