export const createBlogsQuery = `
CREATE TABLE IF NOT EXISTS blogs(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, 
    date TEXT NOT NULL, 
    link TEXT NOT NULL    
);
`;
