import Database from 'better-sqlite3';

const db = new Database(':memory:'); // Using in-memory database for demonstration

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Repositories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS SecurityReports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id INTEGER,
    vulnerability TEXT NOT NULL,
    severity TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(repo_id) REFERENCES Repositories(id)
  );

  CREATE TABLE IF NOT EXISTS ComplianceReports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id INTEGER,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(repo_id) REFERENCES Repositories(id)
  );

  CREATE TABLE IF NOT EXISTS AIRecommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id INTEGER,
    recommendation TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(repo_id) REFERENCES Repositories(id)
  );

  CREATE TABLE IF NOT EXISTS EnergyMetrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cluster_name TEXT NOT NULL,
    usage_kwh REAL NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS AgentLogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_name TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Data
const insertUser = db.prepare('INSERT OR IGNORE INTO Users (email, role) VALUES (?, ?)');
insertUser.run('admin@ecosecure.dev', 'admin');

const insertRepo = db.prepare('INSERT OR IGNORE INTO Repositories (name, url) VALUES (?, ?)');
const repoResult = insertRepo.run('frontend-core', 'https://gitlab.com/ecosecure/frontend-core');
const repoId = repoResult.lastInsertRowid;

const insertSecurity = db.prepare('INSERT INTO SecurityReports (repo_id, vulnerability, severity, status) VALUES (?, ?, ?, ?)');
insertSecurity.run(repoId, 'SQL Injection', 'High', 'Auto-fixed');
insertSecurity.run(repoId, 'Outdated Dependency', 'Medium', 'Pending Review');
insertSecurity.run(repoId, 'Hardcoded Secret', 'Low', 'Auto-fixed');

const insertCompliance = db.prepare('INSERT INTO ComplianceReports (repo_id, type, status) VALUES (?, ?, ?)');
insertCompliance.run(repoId, 'SOC2', 'Passed');
insertCompliance.run(repoId, 'GDPR', 'Passed');
insertCompliance.run(repoId, 'HIPAA', 'Review Needed');

const insertEnergy = db.prepare('INSERT INTO EnergyMetrics (cluster_name, usage_kwh) VALUES (?, ?)');
insertEnergy.run('staging-k8s', 120);
insertEnergy.run('prod-k8s', 450);

const insertLog = db.prepare('INSERT INTO AgentLogs (agent_name, message, status) VALUES (?, ?, ?)');
insertLog.run('Security-AI', 'Scanning 42 changed files...', 'success');
insertLog.run('Security-AI', 'Found 1 vulnerable dependency. Auto-generating fix PR.', 'warning');
insertLog.run('Green-AI', 'Detected idle staging cluster. Scaling down.', 'success');
insertLog.run('Compliance-AI', 'Generating weekly SOC2 audit report...', 'success');

export default db;
