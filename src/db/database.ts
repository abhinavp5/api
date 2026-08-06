import Database from "better-sqlite3";
import {
  createAboutTableQuery,
  createCoursesTableQuery,
  createContactQuery,
  createExperienceQuery,
} from "./schema/profile";
import { createBlogsQuery } from "./schema/blog";
import {
  createArtistsQuery,
  createSongArtistsQuery,
  createTopSongsQuery,
  createSpotifyAuthTableQuery,
} from "./schema/music";
import { createRunsQuery } from "./schema/fitness";
import { seedProfile } from "./seeds/profile.seed";
import { create } from "node:domain";

const db = new Database("data/personal-api.db");

export function initDatabase() {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  const topSongColumns = db.prepare("PRAGMA table_info(topSongs)").all() as Array<{
    name: string;
  }>;
  const hasCurrentMusicSchema = [
    "id",
    "ranking",
    "title",
    "coverart",
    "album",
  ].every((column) => topSongColumns.some(({ name }) => name === column));

  if (topSongColumns.length > 0 && !hasCurrentMusicSchema) {
    db.exec(`
      DROP TABLE IF EXISTS songArtists;
      DROP TABLE IF EXISTS artists;
      DROP TABLE IF EXISTS topSongs;
    `);
  }

  db.exec("DROP TABLE IF EXISTS topArtists");

  //  Creating Tables
  db.exec(createAboutTableQuery);
  db.exec(createCoursesTableQuery);
  db.exec(createContactQuery);
  db.exec(createExperienceQuery);
  db.exec(createBlogsQuery);
  db.exec(createTopSongsQuery);
  db.exec(createArtistsQuery);
  db.exec(createSongArtistsQuery);
  db.exec(createRunsQuery);
  db.exec(createSpotifyAuthTableQuery);

  seedProfile(db);
}
export { db };
