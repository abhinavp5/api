import type { Request, Response } from "express";
import querystring from "node:querystring";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";

interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
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

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        }),
    );
  } else {
    var authOptions = {
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
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      body: new URLSearchParams({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      }),
    });
    const response_data = (await response.json()) as SpotifyAuthResponse;

    // Set Cookie
    res.cookie("spotify_access_token", response_data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: response_data.expires_in * 1000,
    });
    res.redirect("/spotify/token-check");
  }
}

