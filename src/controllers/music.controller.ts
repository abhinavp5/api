import type { Request, Response } from "express";

type topItem = "artists" | "tracks";

// Both fetch directly from the Spotify API
function getTopItems(itemType: topItem) {
  return async (req: Request, res: Response) => {
    const auth_token: string = req.cookies.spotify_access_token;
    if (!auth_token) {
      throw new Error("No Auth Token login with /spotify/login");
    }

    const response = await fetch(
      `https://api.spotify.com/v1/me/top/${itemType}?time_range=short_term&limit=20&offset=0`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      },
    );
    const json_response = await response.json(); // TODO might type this later
    res.json(json_response);
  };
}

export const getTopSongs =  getTopItems("tracks");
export const getTopArtists = getTopItems("artists");