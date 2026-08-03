export const createAboutTableQuery = `
CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    school TEXT,
    major TEXT,
    bio TEXT
);
`;

export const createCoursesTableQuery = `
CREATE TABLE IF NOT EXISTS courses(
    id INTEGER PRIMARY KEY,
    course_dept TEXT NOT NULL,
    course_num INTEGER NOT NULL
);
`;

export const createContactQuery = `
CREATE TABLE IF NOT EXISTS contact(
    id INTEGER PRIMARY KEY,
    website TEXT NOT NULL,
    linkedin TEXT NOT NULL,
    github TEXT NOT NULL
);
`;

export const createExperienceQuery = `
CREATE TABLE IF NOT EXISTS experiences(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    startedAt TEXT NOT NULL,
    endedAt TEXT,
    role TEXT NOT NULL,
    description TEXT
);
`;

export const upsertProfileQuery = `
INSERT INTO profile (id, name, school, major, bio)
VALUES (@id, @name, @school, @major, @bio)
ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    school = excluded.school,
    major = excluded.major,
    bio = excluded.bio;
`;

export const upsertCourseQuery = `
INSERT INTO courses (id,course_dept, course_num)
VALUES (@id, @course_dept, @course_num)
ON CONFLICT(id) DO UPDATE SET
    course_dept = excluded.course_dept,
    course_num = excluded.course_num;
`;

export const upsertContactQuery = `
INSERT INTO contact (id, website, linkedin, github)
VALUES (@id, @website, @linkedin, @github)
ON CONFLICT(id) DO UPDATE SET
    website = excluded.website,
    linkedin = excluded.linkedin,
    github = excluded.github;
`;
