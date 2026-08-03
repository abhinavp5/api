import type { Request, Response } from "express";

// Both fetch directly from the Spotify API
export async function getTopSongs(req: Request, res: Response) {
  const auth_token: string = req.cookies.spotify_access_token;
  console.log(auth_token);
  if (!auth_token) {
    throw new Error("No Auth Token login with /spotify/login");
  }

  const response = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20&offset=0",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    },
  );
  const json_response = await response.json(); // TODO might type this later
  res.json(json_response)
}

export async function getTopArtists(req: Request, res: Response) {
  const auth_token: string = req.cookies.spotify_access_token;
}
