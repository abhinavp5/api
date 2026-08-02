export const aboutTableQuery = `
CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    school TEXT,
    major TEXT,
    bio TEXT
);
`;

export const coursesTableQuery = `
CREATE TABLE IF NOT EXISTS courses(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
    pneuomonic TEXT NOT NULL
);
`;

export const contactQuery = `
CREATE TABLE IF NOT EXISTS courses(
    id INTEGER PRIMARY KEY,
    website TEXT NOT NULL
    linkedin TEXT NOT NULL
    github TEXT NOT NULL
);
`;

export const experienceQuery = `
CREATE TABLE IF NOT EXISTS experiences(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
    startedAt TEXT NOT NULL
    endedAt TEXT
    role TEXT NOT NULL
    description TEXT
);
`;
