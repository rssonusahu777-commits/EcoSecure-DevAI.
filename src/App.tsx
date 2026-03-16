import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Fingerprint, Lock, User, Send, Cpu, ShieldAlert, FileCheck, Zap, Terminal, MessageSquare, Activity, ChevronRight, Shield, FileText, HeartPulse, Settings } from "lucide-react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <Login key="login" onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <MainLayout key="main" />
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}

function Login({ onLogin }: { onLogin: () => void; key?: string }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setStep(2);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) onLogin();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-base grid-bg relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-base/90 pointer-events-none"></div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-10 w-full max-w-md relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-8">
          <Fingerprint className="w-16 h-16 text-accent animate-pulse" strokeWidth={1} />
          <div className="absolute inset-0 bg-accent blur-xl opacity-20 rounded-full animate-pulse"></div>
        </div>
        
        <h2 className="text-2xl font-semibold text-text-primary tracking-widest mb-1">SECURE VAULT</h2>
        <p className="text-xs text-accent/70 font-mono mb-8 tracking-widest uppercase">EcoSecure DevAI Auth</p>

        <div className="w-full">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                onSubmit={handleNext}
                className="flex flex-col gap-4"
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/50" />
                  <input 
                    type="email" 
                    placeholder="OPERATIVE IDENTIFIER" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full input-neon rounded-md py-3 pl-10 pr-4 text-sm font-mono placeholder:text-accent/30"
                    required
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn-neon w-full py-3 rounded-md text-sm font-mono tracking-widest flex items-center justify-center gap-2 mt-2">
                  INITIATE SEQUENCE <ChevronRight className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                onSubmit={handleLogin}
                className="flex flex-col gap-4"
              >
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-success/50" />
                  <input 
                    type="password" 
                    placeholder="DECRYPTION KEY" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full input-neon rounded-md py-3 pl-10 pr-4 text-sm font-mono placeholder:text-success/30 focus:border-success focus:shadow-[0_0_15px_rgba(35,134,54,0.2)]"
                    required
                    autoFocus
                  />
                </div>
                <button type="submit" className="btn-success w-full py-3 rounded-md text-sm font-mono tracking-widest flex items-center justify-center gap-2 mt-2">
                  AUTHORIZE ACCESS <ShieldAlert className="w-4 h-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/dashboard", icon: <Cpu className="w-6 h-6" />, label: "Dashboard" },
    { path: "/security", icon: <Shield className="w-6 h-6" />, label: "Security" },
    { path: "/reports", icon: <FileText className="w-6 h-6" />, label: "Reports" },
    { path: "/agents", icon: <Zap className="w-6 h-6" />, label: "AI Agents" },
    { path: "/monitoring", icon: <HeartPulse className="w-6 h-6" />, label: "System Health" },
    { path: "/settings", icon: <Settings className="w-6 h-6" />, label: "Settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-[#121212]/80 backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-6 z-50">
      <div className="mb-10 text-accent">
        <Cpu className="w-8 h-8 drop-shadow-[0_0_10px_rgba(88,166,255,0.8)]" />
      </div>
      <nav className="flex flex-col gap-6 w-full px-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavItem 
              key={item.path} 
              icon={item.icon} 
              label={item.label} 
              isActive={isActive} 
              onClick={() => navigate(item.path)} 
            />
          );
        })}
      </nav>
    </aside>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void; key?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-full group flex justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Active Indicator Line */}
      {isActive && (
        <motion.div 
          layoutId="activeIndicator"
          className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full shadow-[0_0_10px_rgba(88,166,255,0.8)]"
        />
      )}

      <button 
        onClick={onClick}
        className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isActive 
            ? "bg-accent/10 text-accent shadow-[inset_0_0_20px_rgba(88,166,255,0.2)]" 
            : "text-text-primary/50 hover:bg-white/5 hover:text-accent"
        }`}
      >
        {/* Scanning line animation on hover */}
        {isHovered && !isActive && (
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            <div className="animate-scan-fast" />
          </div>
        )}

        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          className={isActive ? "drop-shadow-[0_0_8px_rgba(88,166,255,0.8)]" : ""}
        >
          {icon}
        </motion.div>
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#121212] border border-accent/20 rounded-md text-xs font-mono text-accent whitespace-nowrap z-50 shadow-[0_0_15px_rgba(0,0,0,0.5)] pointer-events-none"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen bg-base grid-bg flex text-text-primary font-sans">
      <Sidebar />
      <main className="flex-1 ml-20 p-6 h-screen overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

function Dashboard() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "EcoSecure DevAI online. All systems nominal. How can I assist with your DevOps lifecycle today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState({ securityScore: 0, complianceScore: 0, energySaved: "0 kWh", activeAgents: 0 });
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
      
    fetch("/api/agents/status")
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(console.error);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", text: input }]);
    setInput("");
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: "Analyzing request... Dispatching Security Agent to review recent commits." }]);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="h-full w-full flex gap-6"
    >
      {/* Main Content - AI Assistant Face & Chat */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0">
        <header className="h-16 glass-panel mb-4 flex items-center px-6 shrink-0 justify-between">
          <h1 className="font-semibold tracking-wide text-text-primary">COMMAND CENTER</h1>
          <div className="font-mono text-xs text-accent/60 flex items-center gap-4">
            <span>LATENCY: 24ms</span>
            <span>AGENTS: {stats.activeAgents} ACTIVE</span>
          </div>
        </header>

        <div className="flex-1 glass-panel flex flex-col overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-64 h-64 rounded-full bg-accent/5 orb-breathing flex items-center justify-center border border-accent/20 backdrop-blur-sm">
              <div className="w-32 h-32 rounded-full bg-accent/10 border border-accent/40 flex items-center justify-center">
                <Cpu className="w-12 h-12 text-accent opacity-50" />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
            {messages.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i} 
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === "user" 
                    ? "bg-accent/10 border border-accent/20 text-text-primary rounded-br-sm" 
                    : "bg-black/40 border border-white/5 text-text-primary rounded-bl-sm backdrop-blur-md"
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-black/20 border-t border-white/5 z-10 shrink-0">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Command the AI agents..." 
                className="w-full bg-black/50 border border-accent/20 rounded-xl py-4 pl-6 pr-14 text-text-primary placeholder:text-text-primary/30 focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(88,166,255,0.15)] transition-all"
              />
              <button type="submit" className="absolute right-2 p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Data & Logs */}
      <div className="w-80 glass-panel flex flex-col shrink-0 z-10 hidden xl:flex overflow-hidden">
        <div className="p-4 border-b border-white/5 shrink-0">
          <h2 className="font-mono text-xs font-bold text-accent tracking-widest flex items-center gap-2">
            <Terminal className="w-4 h-4" /> TELEMETRY
          </h2>
        </div>
        
        <div className="p-4 space-y-4 shrink-0">
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <div className="bg-black/40 p-3 rounded border border-white/5">
              <div className="text-accent/50 mb-1">SEC SCORE</div>
              <div className="text-lg text-text-primary">{stats.securityScore}</div>
            </div>
            <div className="bg-black/40 p-3 rounded border border-white/5">
              <div className="text-accent/50 mb-1">COMPLIANCE</div>
              <div className="text-lg text-text-primary">{stats.complianceScore}%</div>
            </div>
            <div className="bg-black/40 p-3 rounded border border-white/5 col-span-2">
              <div className="text-green-500/50 mb-1">ENERGY SAVED</div>
              <div className="text-lg text-success">{stats.energySaved}</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 flex-1 flex flex-col min-h-0">
          <h2 className="font-mono text-xs font-bold text-accent tracking-widest mb-4 shrink-0">SYSTEM LOGS</h2>
          <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-3 pr-2">
            {logs.map((log: any) => (
              <LogEntry 
                key={log.id} 
                time={new Date(log.created_at).toLocaleTimeString()} 
                agent={log.agent_name} 
                msg={log.message} 
                color={log.status === 'error' ? 'text-red-400' : log.status === 'warning' ? 'text-yellow-400' : log.status === 'success' ? 'text-success' : 'text-text-primary/70'} 
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LogEntry({ time, agent, msg, color = "text-text-primary/70" }: { time: string, agent: string, msg: string, color?: string }) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-accent/30 pl-2">
      <div className="flex gap-2 text-accent/50">
        <span>{time}</span>
        <span>[{agent}]</span>
      </div>
      <span className={`${color} break-words leading-tight`}>{msg}</span>
    </div>
  );
}

// Placeholder Pages
function SecurityPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/security/reports")
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(console.error);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full glass-panel p-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3"><Shield className="text-accent" /> Security Overview</h1>
      <div className="flex-1 bg-black/20 border border-white/5 rounded-xl p-6 font-mono text-sm text-text-primary/70 overflow-y-auto">
        <p className="mb-4 text-accent">{">>"} Initializing security scan...</p>
        <p className="mb-2">Scanning repositories for vulnerabilities.</p>
        
        <div className="mt-6 space-y-4">
          {reports.map((report: any) => (
            <div key={report.id} className="p-4 border border-white/10 rounded-lg bg-black/40">
              <div className="flex justify-between items-center mb-2">
                <span className={`font-bold ${report.severity === 'High' ? 'text-red-400' : report.severity === 'Medium' ? 'text-yellow-400' : 'text-accent'}`}>
                  [{report.severity}] {report.vulnerability}
                </span>
                <span className="text-xs text-text-primary/50">{new Date(report.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Repo ID: {report.repo_id}</span>
                <span className={`px-2 py-1 rounded-full ${report.status === 'Auto-fixed' ? 'bg-success/20 text-success' : 'bg-yellow-400/20 text-yellow-400'}`}>
                  {report.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/compliance/reports")
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(console.error);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full glass-panel p-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3"><FileText className="text-accent" /> Compliance Reports</h1>
      <div className="flex-1 bg-black/20 border border-white/5 rounded-xl p-6 font-mono text-sm text-text-primary/70 overflow-y-auto">
        <p className="mb-4 text-accent">{">>"} Fetching audit logs...</p>
        
        <div className="mt-6 space-y-4">
          {reports.map((report: any) => (
            <div key={report.id} className="p-4 border border-white/10 rounded-lg bg-black/40">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-accent">{report.type} Compliance Check</span>
                <span className="text-xs text-text-primary/50">{new Date(report.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Repo ID: {report.repo_id}</span>
                <span className={`px-2 py-1 rounded-full ${report.status === 'Passed' ? 'bg-success/20 text-success' : 'bg-yellow-400/20 text-yellow-400'}`}>
                  {report.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AgentsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/agents/status")
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(console.error);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full glass-panel p-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3"><Zap className="text-accent" /> AI Agents Activity</h1>
      <div className="flex-1 bg-black/20 border border-white/5 rounded-xl p-6 font-mono text-sm text-text-primary/70 overflow-y-auto">
        <p className="mb-4 text-accent">{">>"} Active Agents: 4</p>
        <p className="mb-2">- SecurityFixAgent: Online</p>
        <p className="mb-2">- CodeReviewAgent: Online</p>
        <p className="mb-2">- ComplianceAgent: Online</p>
        <p className="mb-2">- GreenOptimizationAgent: Online</p>
        
        <div className="mt-8">
          <h3 className="text-accent mb-4">Recent Agent Activity</h3>
          <div className="space-y-2">
            {logs.map((log: any) => (
              <div key={log.id} className="flex gap-4 border-b border-white/5 pb-2">
                <span className="text-text-primary/50 w-24 shrink-0">{new Date(log.created_at).toLocaleTimeString()}</span>
                <span className="text-accent w-32 shrink-0">[{log.agent_name}]</span>
                <span className={log.status === 'error' ? 'text-red-400' : log.status === 'warning' ? 'text-yellow-400' : log.status === 'success' ? 'text-success' : 'text-text-primary/70'}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MonitoringPage() {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/energy/metrics")
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(console.error);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full glass-panel p-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3"><HeartPulse className="text-accent" /> System Health</h1>
      <div className="flex-1 bg-black/20 border border-white/5 rounded-xl p-6 font-mono text-sm text-text-primary/70 overflow-y-auto">
        <p className="mb-4 text-accent">{">>"} Real-time Telemetry</p>
        <p className="mb-2">CPU Usage: 14%</p>
        <p className="mb-2">Memory: 4.2GB / 16GB</p>
        
        <div className="mt-8">
          <h3 className="text-accent mb-4">Energy Metrics</h3>
          <div className="space-y-2">
            {metrics.map((metric: any) => (
              <div key={metric.id} className="flex justify-between items-center p-3 border border-white/5 rounded bg-black/20">
                <span>Cluster: {metric.cluster_name}</span>
                <span className="text-success">{metric.usage_kwh} kWh</span>
                <span className="text-xs text-text-primary/50">{new Date(metric.recorded_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full glass-panel p-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3"><Settings className="text-accent" /> Configuration</h1>
      <div className="flex-1 bg-black/20 border border-white/5 rounded-xl p-6 font-mono text-sm text-text-primary/70">
        <p className="mb-4 text-accent">{">>"} System Settings</p>
        <p className="mb-2">Agent Autonomy Level: HIGH</p>
        <p className="mb-2">Auto-Merge Fixes: ENABLED</p>
        <p className="mb-2">Alert Webhooks: CONFIGURED</p>
        
        <div className="mt-8 space-y-4">
          <button 
            className="btn-neon px-4 py-2 rounded text-sm"
            onClick={() => {
              fetch('/api/webhook/gitlab', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event_name: 'push', project: { name: 'frontend-core' } })
              }).then(() => alert('Simulated GitLab Webhook Triggered! Check Dashboard logs.'));
            }}
          >
            Simulate GitLab Webhook
          </button>
        </div>
      </div>
    </motion.div>
  );
}
