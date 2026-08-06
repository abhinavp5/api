import type { Request, Response } from "express";
import querystring from "node:querystring";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import { db } from "../db/database";
import { upsertSpotifyAuthQuery } from "../db/schema/music";
import { seedTopSongs } from "../db/seeds/spotify.seed";
import type {
  SpotifyAuthResponse,
  SpotifyTopTracksResponse,
} from "../../types";

const generateRandomString = (): string =>
  crypto.randomBytes(16).toString("hex");
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const client_id = process.env.SPOTIFY_CLIENT_ID;

export function handleLogin(req: Request, res: Response) {
  console.log("Handling Spotify Login");
  const state = generateRandomString();
  const scope = "user-read-private user-read-email user-top-read";
  if (!client_id || !redirect_uri) {
    throw new Error("Spotify client ID or redirect URI not configured");
  }

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      }),
  );
}

export async function handleCallback(req: Request, res: Response) {
  console.log("Handling Spotify Callback");
  const code = req.query.code || null;
  if (typeof code !== "string") {
    throw new Error("Invalid Code Query");
  }
  const state = req.query.state || null;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!client_id || !client_secret || !redirect_uri) {
    throw new Error("Spotify client credentials are not configured");
  }

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        }),
    );
  } else {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    const response = await fetch(authOptions.url, {
      method: "POST",
      headers: authOptions.headers,
      body: new URLSearchParams(authOptions.form),
    });
    const response_data = (await response.json()) as SpotifyAuthResponse;

    if (!response.ok) {
      throw new Error(
        `Spotify token exchange failed (${response.status}): ${JSON.stringify(response_data)}`,
      );
    }

    if (!response_data.access_token) {
      throw new Error("Spotify token response did not contain an access token");
    }

    const upsertSpotifyAuth = db.prepare(upsertSpotifyAuthQuery);
    const now = Date.now();

    upsertSpotifyAuth.run({
      auth_token: response_data.access_token,
      auth_token_expires_at: now + response_data.expires_in * 1000,
      refresh_token: response_data.refresh_token,
      refresh_token_expires_at: now + 1000 * 60 * 60 * 24 * 30 * 5,
    });

    // Set Access Token Cookie Once - refreshed every hour
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("spotify_access_token", response_data.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: response_data.expires_in * 1000,
    });

    await seedSpotifyTopData();
    res.redirect("/spotify/token-check");
  }

  async function seedSpotifyTopData() {
    const topTracksUrl = new URL("https://api.spotify.com/v1/me/top/tracks");
    topTracksUrl.search = new URLSearchParams({
      time_range: "short_term",
      limit: "20",
      offset: "0",
    }).toString();
    const access_token = db
      .prepare("SELECT auth_token FROM spotifyAuth WHERE id = 1")
      .pluck()
      .get() as string;

    const topTracksResponse = await fetch(topTracksUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const topTracksText = await topTracksResponse.text();
    if (!topTracksResponse.ok) {
      throw new Error(
        `Spotify top tracks request failed (${topTracksResponse.status}): ${topTracksText}`,
      );
    }

    const topTracks = JSON.parse(topTracksText) as SpotifyTopTracksResponse;
    if (!Array.isArray(topTracks.items)) {
      throw new Error(
        "Spotify top tracks response did not contain an items array",
      );
    }

    seedTopSongs(db, topTracks.items);
  }
}
