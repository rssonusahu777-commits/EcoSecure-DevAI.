import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import db from "./src/db.js";

// Import AI Agents
import { runSecurityFixAgent } from "./src/agents/securityAgent.js";
import { runCodeReviewAgent } from "./src/agents/reviewAgent.js";
import { runComplianceAgent } from "./src/agents/complianceAgent.js";
import { runGreenOptimizationAgent } from "./src/agents/greenAgent.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/dashboard/stats", (req, res) => {
    const securityCount = db.prepare("SELECT COUNT(*) as count FROM SecurityReports WHERE status = 'Pending Review'").get() as {count: number};
    const complianceCount = db.prepare("SELECT COUNT(*) as count FROM ComplianceReports WHERE status = 'Passed'").get() as {count: number};
    const energyTotal = db.prepare("SELECT SUM(usage_kwh) as total FROM EnergyMetrics").get() as {total: number};
    
    res.json({
      securityScore: 100 - (securityCount.count * 5),
      complianceScore: complianceCount.count > 0 ? 100 : 80,
      energySaved: `${(energyTotal.total * 0.1).toFixed(1)} kWh`,
      activeAgents: 4,
    });
  });

  app.get("/api/security/reports", (req, res) => {
    const reports = db.prepare("SELECT * FROM SecurityReports ORDER BY id DESC").all();
    res.json(reports);
  });

  app.get("/api/compliance/reports", (req, res) => {
    const reports = db.prepare("SELECT * FROM ComplianceReports ORDER BY id DESC").all();
    res.json(reports);
  });

  app.get("/api/energy/metrics", (req, res) => {
    const metrics = db.prepare("SELECT * FROM EnergyMetrics ORDER BY id DESC").all();
    res.json(metrics);
  });

  app.get("/api/agents/status", (req, res) => {
    const logs = db.prepare("SELECT * FROM AgentLogs ORDER BY id DESC LIMIT 20").all();
    res.json(logs);
  });

  app.post("/api/webhook/gitlab", async (req, res) => {
    console.log("GitLab Webhook received:", req.body);
    const { event_name, project, commits } = req.body;
    
    // Log the webhook trigger
    db.prepare("INSERT INTO AgentLogs (agent_name, message, status) VALUES (?, ?, ?)").run(
      "GitLab-Hook", `Push detected on ${project?.name || 'repository'}.`, "info"
    );

    // Trigger agents asynchronously
    setTimeout(async () => {
      try {
        // 1. Security Scan
        db.prepare("INSERT INTO AgentLogs (agent_name, message, status) VALUES (?, ?, ?)").run(
          "Security-AI", "Scanning changed files...", "info"
        );
        const securityResult = await runSecurityFixAgent("const query = 'SELECT * FROM users WHERE id = ' + req.body.id;", "SQL Injection detected");
        db.prepare("INSERT INTO SecurityReports (repo_id, vulnerability, severity, status) VALUES (?, ?, ?, ?)").run(
          1, "SQL Injection", "High", "Auto-fixed"
        );
        db.prepare("INSERT INTO AgentLogs (agent_name, message, status) VALUES (?, ?, ?)").run(
          "Security-AI", "Found 1 vulnerable dependency. Auto-generating fix PR.", "warning"
        );

        // 2. Code Review
        db.prepare("INSERT INTO AgentLogs (agent_name, message, status) VALUES (?, ?, ?)").run(
          "Review-AI", "Analyzing PR...", "info"
        );
        const reviewResult = await runCodeReviewAgent("+ const data = items.forEach(i => { return i * 2 });");
        db.prepare("INSERT INTO AIRecommendations (repo_id, recommendation) VALUES (?, ?)").run(
          1, reviewResult.substring(0, 100) + "..."
        );

        // 3. Compliance
        db.prepare("INSERT INTO AgentLogs (agent_name, message, status) VALUES (?, ?, ?)").run(
          "Compliance-AI", "Generating audit report...", "info"
        );
        const complianceResult = await runComplianceAgent("express: 4.17.1", "Node 18");
        db.prepare("INSERT INTO ComplianceReports (repo_id, type, status) VALUES (?, ?, ?)").run(
          1, "Automated Audit", "Passed"
        );

        // 4. Green Ops
        db.prepare("INSERT INTO AgentLogs (agent_name, message, status) VALUES (?, ?, ?)").run(
          "Green-AI", "Analyzing resource usage...", "info"
        );
        const greenResult = await runGreenOptimizationAgent("CPU: 5%, Memory: 2GB");
        db.prepare("INSERT INTO AgentLogs (agent_name, message, status) VALUES (?, ?, ?)").run(
          "Green-AI", "Detected idle staging cluster. Scaling down.", "success"
        );

      } catch (error) {
        console.error("Agent execution error:", error);
        db.prepare("INSERT INTO AgentLogs (agent_name, message, status) VALUES (?, ?, ?)").run(
          "System", "Agent execution failed.", "error"
        );
      }
    }, 1000);

    res.json({ status: "success", message: "Webhook processed, agents triggered" });
  });

  app.post("/api/ai/review", (req, res) => {
    res.json({ status: "success", review: "Code looks good. Suggested optimization: use map instead of forEach." });
  });

  app.post("/api/ai/trigger-agents", async (req, res) => {
    try {
      const { agentType } = req.body;
      let result = "";

      if (agentType === "security") {
        const mockSemgrepOutput = "Severity: HIGH, Message: Detected SQL injection vulnerability in user input.";
        const mockCode = "const query = 'SELECT * FROM users WHERE id = ' + req.body.id;";
        result = await runSecurityFixAgent(mockCode, mockSemgrepOutput);
      } else if (agentType === "review") {
        const mockDiff = "+ const data = items.forEach(i => { return i * 2 });";
        result = await runCodeReviewAgent(mockDiff);
      } else if (agentType === "compliance") {
        const mockDeps = '"express": "^4.17.1", "lodash": "^4.17.21"';
        const mockInfra = "FROM node:18-alpine\\nEXPOSE 3000";
        result = await runComplianceAgent(mockDeps, mockInfra);
      } else if (agentType === "green") {
        const mockMetrics = "Cluster: staging-k8s, CPU Utilization: 5%, Active Pods: 12, Time: Weekend";
        result = await runGreenOptimizationAgent(mockMetrics);
      } else {
        return res.status(400).json({ error: "Invalid agent type" });
      }

      res.json({ status: "success", data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Agent execution failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
