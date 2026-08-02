export const topSongsQuery = `
CREATE TABLE IF NOT EXISTS topSongs(
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL, 
    artist TEXT NOT NULL, 
    album TEXT NOT NULL, 
);
`;

export const topArtistsQuery = `
CREATE TABLE IF NOT EXISTS topArtists(
    id TEXT PRIMARY KEY,
    artist TEXT NOT NULL, 
);
`;
