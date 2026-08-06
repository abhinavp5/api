import type Database from "better-sqlite3";
import type { SpotifyTopTrack } from "../../../types";

export function seedTopSongs(
  db: Database.Database,
  tracks: SpotifyTopTrack[],
) {
  const clearSongArtists = db.prepare("DELETE FROM songArtists");
  const clearTopSongs = db.prepare("DELETE FROM topSongs");
  const clearArtists = db.prepare("DELETE FROM artists");

  const insertSong = db.prepare(`
    INSERT INTO topSongs (id, ranking, title, coverart, album)
    VALUES (@id, @ranking, @title, @coverart, @album)
  `);
  const insertArtist = db.prepare(`
    INSERT INTO artists (id, name)
    VALUES (@id, @name)
    ON CONFLICT(id) DO UPDATE SET name = excluded.name
  `);
  const insertSongArtist = db.prepare(`
    INSERT INTO songArtists (song_id, artist_id, position)
    VALUES (@song_id, @artist_id, @position)
  `);

  const seed = db.transaction((topTracks: SpotifyTopTrack[]) => {
    clearSongArtists.run();
    clearTopSongs.run();
    clearArtists.run();

    topTracks.forEach((track, trackIndex) => {
      insertSong.run({
        id: track.id,
        ranking: trackIndex + 1,
        title: track.name,
        coverart: track.album.images[0]?.url ?? null,
        album: track.album.name,
      });

      track.artists.forEach((artist, artistIndex) => {
        insertArtist.run(artist);
        insertSongArtist.run({
          song_id: track.id,
          artist_id: artist.id,
          position: artistIndex,
        });
      });
    });
  });

  seed(tracks);
}
