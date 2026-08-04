export const createTopSongsQuery = `
CREATE TABLE IF NOT EXISTS topSongs(
    id TEXT PRIMARY KEY,
    ranking INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    coverart TEXT,
    album TEXT NOT NULL
);
`;

export const createArtistsQuery = `
CREATE TABLE IF NOT EXISTS artists(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);
`;

export const createSongArtistsQuery = `
CREATE TABLE IF NOT EXISTS songArtists(
    song_id TEXT NOT NULL,
    artist_id TEXT NOT NULL,
    position INTEGER NOT NULL,
    PRIMARY KEY (song_id, artist_id),
    FOREIGN KEY (song_id) REFERENCES topSongs(id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);
`;
