import cron from "node-cron";
import { Buffer } from "node:buffer";
import { db } from "../db/database";
import { updateSpotifyAccessTokenQuery } from "../db/schema/music";
import { seedTopSongs } from "../db/seeds/spotify.seed";
import type {
  SpotifyRefreshResponse,
  SpotifyTopTracksResponse,
} from "../../types";

function getStoredRefreshToken(): string {
  const refreshToken = db
    .prepare("SELECT refresh_token FROM spotifyAuth WHERE id = 1")
    .pluck()
    .get();

  if (typeof refreshToken !== "string") {
    throw new Error("No Spotify refresh token");
  }

  return refreshToken;
}

export async function refreshAuthToken(): Promise<string> {
  const refreshToken = getStoredRefreshToken();
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify client credentials are not configured");
  }
  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  };
  
  const result = await fetch(url, payload);
  const response = (await result.json()) as SpotifyRefreshResponse;

  if (!result.ok || !response.access_token) {
    throw new Error(`Spotify token refresh failed (${result.status})`);
  }

  db.prepare(updateSpotifyAccessTokenQuery).run({
    auth_token: response.access_token,
    auth_token_expires_at: Date.now() + response.expires_in * 1000, // expires in 1 hour
    refresh_token: response.refresh_token ?? null,
  });

  return response.access_token;
}

export async function updateTopSongs(accessToken: string): Promise<void> {
  const topTracksUrl = new URL("https://api.spotify.com/v1/me/top/tracks");
  topTracksUrl.search = new URLSearchParams({
    time_range: "short_term",
    limit: "20",
    offset: "0",
  }).toString();

  const result = await fetch(topTracksUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const response = (await result.json()) as SpotifyTopTracksResponse;

  if (!result.ok || !Array.isArray(response.items)) {
    throw new Error(`Spotify top-tracks request failed (${result.status})`);
  }

  seedTopSongs(db, response.items);
}

export async function syncSpotifyMusic(): Promise<void> {
  const accessToken = await refreshAuthToken();
  await updateTopSongs(accessToken);
}

export const syncNewMusic = cron.createTask(
  "0 * * * *",
  async () => {
    try {
      await syncSpotifyMusic();
    } catch (error) {
      console.error("Spotify music sync failed", error);
    }
  },
  {
    name: "spotify-music-sync",
    noOverlap: true,
  },
);
