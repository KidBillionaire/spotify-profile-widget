const http = require("http");
const { spawn } = require("child_process");
const querystring = require("querystring");

const CLIENT_ID = "46c23edd187d4933bc56983d18bfd382";
const REDIRECT_URI = "http://localhost:8888/callback";
const PORT = 8888;

console.log("\n🎵 Spotify Widget - Credential Setup\n");
console.log("====================================\n");

// Step 1: Get Client Secret from user
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "Step 1: Enter your Spotify Client Secret from the dashboard: ",
  (clientSecret) => {
    if (!clientSecret) {
      console.log("❌ Client Secret is required!");
      process.exit(1);
    }

    console.log("\n✅ Client Secret saved!\n");
    console.log("Step 2: Opening browser for authorization...\n");

    // Create local server to receive callback
    const server = http.createServer(async (req, res) => {
      if (req.url.startsWith("/callback")) {
        const query = querystring.parse(req.url.split("?")[1]);
        const code = query.code;

        if (!code) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end("<h1>Error: No authorization code received</h1>");
          return;
        }

        // Exchange code for tokens
        try {
          const tokenData = querystring.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: clientSecret,
          });

          const https = require("https");
          const options = {
            hostname: "accounts.spotify.com",
            path: "/api/token",
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Content-Length": tokenData.length,
            },
          };

          const tokenReq = https.request(options, (tokenRes) => {
            let data = "";
            tokenRes.on("data", (chunk) => {
              data += chunk;
            });
            tokenRes.on("end", () => {
              const tokens = JSON.parse(data);

              if (tokens.refresh_token) {
                console.log("\n\n✅ SUCCESS! Got your credentials!\n");
                console.log(
                  "==================== COPY THESE ====================\n"
                );
                console.log(`SPOTIFY_CLIENT_ID=${CLIENT_ID}`);
                console.log(`SPOTIFY_CLIENT_SECRET=${clientSecret}`);
                console.log(`SPOTIFY_REFRESH_TOKEN=${tokens.refresh_token}\n`);
                console.log(
                  "====================================================\n"
                );
                console.log(
                  "Next: Deploy to Vercel and add these as environment variables!\n"
                );

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(`
                <html>
                  <body style="background: #0d1117; color: #fff; font-family: Arial; text-align: center; padding: 50px;">
                    <h1 style="color: #53b14f;">✅ Authorization Successful!</h1>
                    <p>You can close this window and return to your terminal.</p>
                    <p>Your credentials have been printed in the terminal.</p>
                  </body>
                </html>
              `);

                setTimeout(() => {
                  server.close();
                  rl.close();
                  process.exit(0);
                }, 2000);
              } else {
                console.log("❌ Error:", tokens);
                res.writeHead(400, { "Content-Type": "text/html" });
                res.end("<h1>Error getting tokens</h1>");
                server.close();
                rl.close();
                process.exit(1);
              }
            });
          });

          tokenReq.write(tokenData);
          tokenReq.end();
        } catch (error) {
          console.error("❌ Error:", error);
          res.writeHead(500, { "Content-Type": "text/html" });
          res.end("<h1>Error</h1>");
          server.close();
          rl.close();
          process.exit(1);
        }
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    server.listen(PORT, () => {
      const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify(
        {
          client_id: CLIENT_ID,
          response_type: "code",
          redirect_uri: REDIRECT_URI,
          scope: "user-read-currently-playing user-read-playback-state",
        }
      )}`;

      console.log(`Server running at http://localhost:${PORT}\n`);
      console.log("Opening browser for authorization...\n");
      console.log("If browser doesn't open, visit this URL:\n");
      console.log(authUrl + "\n");

      // Try to open browser
      const open =
        process.platform === "darwin"
          ? "open"
          : process.platform === "win32"
          ? "start"
          : "xdg-open";
      spawn(open, [authUrl]);
    });
  }
);
