import Database from "better-sqlite3";
import type { Request, Response } from "express";
import type { CourseRow } from "../../types";
const db = new Database("data/personal-api.db");

export function getAbout(req: Request, res: Response) {
  const select_desc = db.prepare(
    "SELECT name,school,major,bio FROM profile WHERE ID = 1",
  );
  const myDescription = select_desc.get();
  res.json(myDescription);
}

export function getCourses(req: Request, res: Response) {
  // TODO: add a certain more granular course based choices
  var finalCourses: String[];
  const rows = db
    .prepare("SELECT course_dept, course_num from courses")
    .all() as CourseRow[];

  const courses = rows.map(
    ({ course_dept, course_num }) => `${course_dept} ${course_num}`,
  );
  res.json({ courses });
}

export function getContact(req: Request, res: Response) {
  const select_desc = db.prepare(
    "SELECT website,linkedin,github FROM contact WHERE ID = 1",
  );
  const myContact = select_desc.get();
  res.json(myContact);
}

export function getExperience(req: Request, res: Response) {
  //TODO: Fill in Later
}
