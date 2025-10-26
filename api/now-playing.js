const axios = require("axios");
const querystring = require("querystring");

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const getAccessToken = async () => {
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const response = await axios.post(
    TOKEN_ENDPOINT,
    querystring.stringify({
      grant_type: "refresh_token",
      refresh_token,
    }),
    {
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};

const getNowPlaying = async () => {
  const access_token = await getAccessToken();

  return axios.get(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const generateSVG = (data) => {
  if (!data || !data.item) {
    return `
      <svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="120" fill="#0d1117" rx="10"/>
        <text x="200" y="60" font-family="Arial" font-size="16" fill="#53b14f" text-anchor="middle">
          Not Playing - Spotify
        </text>
      </svg>
    `;
  }

  const { item } = data;
  const track = item.name;
  const artist = item.artists.map((a) => a.name).join(", ");
  const albumArt = item.album.images[0]?.url || "";

  return `
    <svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .container { fill: #0d1117; }
          .track { fill: #ffffff; font-family: Arial; font-size: 16px; font-weight: bold; }
          .artist { fill: #b3b3b3; font-family: Arial; font-size: 14px; }
          .playing { fill: #53b14f; font-family: Arial; font-size: 12px; }
        </style>
      </defs>
      <rect class="container" width="400" height="120" rx="10"/>
      <image href="${albumArt}" x="10" y="10" width="100" height="100" clip-path="inset(0% round 8px)"/>
      <text class="playing" x="120" y="25">▶ Now Playing on Spotify</text>
      <text class="track" x="120" y="55">${
        track.length > 25 ? track.substring(0, 25) + "..." : track
      }</text>
      <text class="artist" x="120" y="75">${
        artist.length > 30 ? artist.substring(0, 30) + "..." : artist
      }</text>
    </svg>
  `;
};

module.exports = async (_req, res) => {
  try {
    const response = await getNowPlaying();

    if (response.status === 204 || !response.data.item) {
      const svg = generateSVG(null);
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=60");
      return res.status(200).send(svg);
    }

    const svg = generateSVG(response.data);
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=60");
    res.status(200).send(svg);
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    const svg = generateSVG(null);
    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(svg);
  }
};
