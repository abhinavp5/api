export const createRunsQuery = `
CREATE TABLE IF NOT EXISTS runs(
    id INTEGER PRIMARY KEY,
    distance REAL NOT NULL, 
    averageSpeed REAL NOT NULL
);
`;
