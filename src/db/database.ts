import Database from "better-sqlite3";
import {
  createAboutTableQuery,
  createCoursesTableQuery,
  createContactQuery,
  createExperienceQuery,
} from "./schema/profile";
import { createBlogsQuery } from "./schema/blog";
import { createTopSongsQuery, createTopArtistsQuery } from "./schema/music";
import { createRunsQuery } from "./schema/fitness";
import { seedProfile } from "./seeds/profile.seed";

const db = new Database("data/personal-api.db");
db.pragma("journal_mode = WAL");

//  Creating Tables
db.exec(createAboutTableQuery);
db.exec(createCoursesTableQuery);
db.exec(createContactQuery);
db.exec(createExperienceQuery);
db.exec(createBlogsQuery);
db.exec(createTopSongsQuery);
db.exec(createTopArtistsQuery);
db.exec(createRunsQuery);

seedProfile(db);
