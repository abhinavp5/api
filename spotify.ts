import express from "express";
import querystring from "node:querystring";
import crypto from "node:crypto";

const app = express();

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const redirectUri = "http://127.0.0.1:8888/callback";

function generateRandomString(length: number): string {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

app.get("/login", (req, res) => {
  const state = generateRandomString(16);

  const scope = [
    "user-read-private",
    "user-read-email",
    "user-read-recently-played",
    "user-top-read",
    "user-library-read",
  ].join(" ");
  const authorizationUrl =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      state,
    });

  res.redirect(authorizationUrl);
});
