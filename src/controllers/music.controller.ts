import type { Request, Response } from "express";
import { db } from "../db/database";

interface TopSongRow {
  id: string;
  ranking: number;
  title: string;
  coverart: string | null;
  album: string;
}

interface ArtistRow {
  id: string;
  name: string;
}

export function getTopSongs(req: Request, res: Response) {
  const selectTopSongs = db.prepare(`
    SELECT id, ranking, title, coverart, album
    FROM topSongs
    ORDER BY ranking
  `);
  const selectSongArtists = db.prepare(`
    SELECT artists.id, artists.name
    FROM artists
    JOIN songArtists ON songArtists.artist_id = artists.id
    WHERE songArtists.song_id = ?
    ORDER BY songArtists.position
  `);

  const rows = selectTopSongs.all() as TopSongRow[];
  const songs = rows.map((song) => ({
    ...song,
    artists: selectSongArtists.all(song.id) as ArtistRow[],
  }));

  res.json({ songs });
}
