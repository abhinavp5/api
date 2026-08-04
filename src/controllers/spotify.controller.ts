import type { Request, Response } from "express";
import querystring from "node:querystring";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import { db } from "../db/database";
import {
  seedTopSongs,
  type SpotifyTopTrack,
} from "../db/seeds/spotify.seed";

interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface SpotifyTopTracksResponse {
  items: SpotifyTopTrack[];
}

const generateRandomString = (): string =>
  crypto.randomBytes(16).toString("hex");
const redirect_uri = "http://127.0.0.1:3000/spotify/callback";
const client_id = process.env.SPOTIFY_CLIENT_ID;

export function handleLogin(req: Request, res: Response) {
  console.log("Handling Spotify Login");
  const state = generateRandomString();
  const scope = "user-read-private user-read-email user-top-read";
  if (!client_id) {
    throw new Error("No Spotify Client ID set");
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

  if (!client_id || !client_secret) {
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

    const topTracksUrl = new URL("https://api.spotify.com/v1/me/top/tracks");
    topTracksUrl.search = new URLSearchParams({
      time_range: "short_term",
      limit: "20",
      offset: "0",
    }).toString();

    const topTracksResponse = await fetch(topTracksUrl, {
      headers: {
        Authorization: `Bearer ${response_data.access_token}`,
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
      throw new Error("Spotify top tracks response did not contain an items array");
    }

    seedTopSongs(db, topTracks.items);

    // Set Cookie
    res.cookie("spotify_access_token", response_data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: response_data.expires_in * 1000,
    });
    res.redirect("/spotify/token-check");
  }
}
