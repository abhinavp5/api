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

export const createSpotifyAuthTableQuery = `
CREATE TABLE IF NOT EXISTS spotifyAuth(
    id INTEGER PRIMARY KEY CHECK (id = 1),
    auth_token TEXT NOT NULL,
    auth_token_expires_at INTEGER NOT NULL,
    refresh_token TEXT NOT NULL,
    refresh_token_expires_at INTEGER NOT NULL
);
`;

export const upsertSpotifyAuthQuery = `
INSERT INTO spotifyAuth (
    id,
    auth_token,
    auth_token_expires_at,
    refresh_token,
    refresh_token_expires_at
)
VALUES (1, @auth_token, @auth_token_expires_at, @refresh_token, @refresh_token_expires_at)
ON CONFLICT(id) DO UPDATE SET
    auth_token = excluded.auth_token,
    auth_token_expires_at = excluded.auth_token_expires_at,
    refresh_token = excluded.refresh_token,
    refresh_token_expires_at = excluded.refresh_token_expires_at;
`;

export const updateSpotifyAccessTokenQuery = `
UPDATE spotifyAuth
SET auth_token = @auth_token,
    auth_token_expires_at = @auth_token_expires_at,
    refresh_token = COALESCE(@refresh_token, refresh_token)
WHERE id = 1;
`;

export const clearSpotifyAuthQuery = `DELETE FROM spotifyAuth WHERE id = 1;`;
