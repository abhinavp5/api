import type { Request, Response } from "express";

export function getAbout(req: Request, res: Response) {
  res.json({
    name: "Abhinav Pappu",
    description: "4th year Electrical and Computer Engineering student at UVA",
  });
}

export function getCourses(req: Request, res: Response){
  const courses: Array<String> = [
    "BIOL 2100",
    "BIOL 2200",
    "CHEM 1411",
    "CHEM 1810",
    "COLA 1500",
    "CS 2100",
    "CS 2120",
    "CS 2130",
    "CS 3100",
    "CS 3130",
    "CS 3140",
    "CS 3501",
    "CS 3710",
    "CS 4330",
    "CS 4444",
    "ECE 2200",
    "ECE 2300",
    "ECE 2330",
    "ECE 2600",
    "ECE 2700",
    "ECE 3103",
    "ECE 3430",
    "ECE 3502",
    "ECE 3660",
    "ECE 4332",
    "ECE 4435",
    "ECE 4440",
    "EGMT 1510",
    "EGMT 1520",
    "EGMT 1530",
    "EGMT 1540",
    "ENWR 1510",
    "MATH 1310",
    "MATH 1320",
    "MATH 2310",
    "MATH 2670",
    "MATH 3100",
    "PHIL 1410",
    "PHYS 1425",
    "PHYS 1429",
    "RELG 1040",
    "SPAN 1060",
    "SPAN 2010",
    "SPAN 2020",
    "STAT 1601",
    "STS 2600",
    "STS 4500",
  ];
  res.json({ courses: courses });
}

export function getContact(req: Request, res: Response) {
  res.json({
    website: "abhinavpappu.xyz",
    linkedin: "linkedin.com/in/abhinav-pappu",
    github: "github.com/abhinavp5",
  });
}

export function getExperience(req: Request, res: Response) {
  //TODO: Fill in Later
  const experiences: experienceEntry[] = [
    {
      name: "Cvent",
      startedAt: "2026-06-01T12:00:00Z",
      description: "Intern"
    },
  ];
  res.json({ experience: experiences});
}
