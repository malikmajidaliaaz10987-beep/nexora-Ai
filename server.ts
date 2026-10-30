/**
 * NEXORA AI — Full-Stack Server
 * Express API backend + Vite development middleware
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db, hashPassword, generateToken, verifyToken } from './server/db.js';
import { executeStudioAI, calculateBusinessDocument, getAIProviderStatus } from './server/ai.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logger for API calls
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    const start = Date.now();
    res.on('finish', () => {
      console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${Date.now() - start}ms)`);
    });
  }
  next();
});

// Authentication middleware
interface AuthenticatedRequest extends Request {
  user?: any;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (decoded && decoded.userId) {
    const profile = db.findProfileById(decoded.userId);
    if (profile) {
      req.user = profile;
    }
  }
  next();
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  next();
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }
  next();
}

app.use(authMiddleware);

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.get('/api/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.json({ user: null });
  }
  const credits = db.getCreditBalance(req.user.id);
  const sub = db.getSubscription(req.user.id);
  const notifications = db.getRawData().notifications.filter(n => n.user_id === req.user.id);

  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.full_name,
      avatarUrl: req.user.avatar_url,
      role: req.user.role,
      company: req.user.company,
      bio: req.user.bio,
      createdAt: req.user.created_at
    },
    credits,
    subscription: sub.subscription,
    plan: sub.plan,
    notifications
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Full name, email, and password are required.' });
  }

  const existing = db.findProfileByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }

  const profile = db.createProfile(email, hashPassword(password), fullName, 'free');
  const token = generateToken(profile.id);

  res.status(201).json({
    token,
    user: {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      role: profile.role
    }
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const profile = db.findProfileByEmail(email);
  if (!profile || profile.password_hash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = generateToken(profile.id);
  res.json({
    token,
    user: {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      role: profile.role
    }
  });
});

// Main account instant access (Platform Owner: Asad Ali Awan)
app.post('/api/auth/main-account', (req: Request, res: Response) => {
  const profile = db.findProfileByEmail('asad@nexora.ai') || db.getRawData().profiles[0];
  if (!profile) {
    return res.status(404).json({ error: 'Main profile not found.' });
  }

  const token = generateToken(profile.id);
  res.json({
    token,
    user: {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      role: profile.role,
      company: profile.company
    }
  });
});

app.post('/api/auth/switch-demo', (req: Request, res: Response) => {
  const profile = db.findProfileByEmail('asad@nexora.ai') || db.getRawData().profiles[0];
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found.' });
  }

  const token = generateToken(profile.id);
  res.json({
    token,
    user: {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      role: profile.role,
      company: profile.company
    }
  });
});

app.post('/api/auth/update-profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { fullName, company, bio, avatarUrl } = req.body;
  const updated = db.updateProfile(req.user.id, {
    full_name: fullName || req.user.full_name,
    company: company !== undefined ? company : req.user.company,
    bio: bio !== undefined ? bio : req.user.bio,
    avatar_url: avatarUrl || req.user.avatar_url
  });
  res.json({ success: true, user: updated });
});

app.delete('/api/auth/delete-account', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  db.deleteProfile(req.user.id);
  res.json({ success: true, message: 'Account permanently deleted.' });
});

// ==========================================
// CREDITS & TRANSACTIONS
// ==========================================

app.get('/api/credits/balance', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const cb = db.getCreditBalance(req.user.id);
  res.json({ creditBalance: cb });
});

app.get('/api/credits/transactions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const txs = db.getTransactions(req.user.id);
  res.json({ transactions: txs });
});

// ==========================================
// AI STUDIOS EXECUTION
// ==========================================

app.post('/api/ai/generate', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { studio, tool, prompt, parameters, creditCost } = req.body;

  if (!studio || !tool || !prompt) {
    return res.status(400).json({ error: 'Studio, tool name, and prompt are required.' });
  }

  const result = await executeStudioAI({
    userId: req.user.id,
    studio,
    tool,
    prompt,
    parameters: parameters || {},
    creditCost: creditCost || 10
  });

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json(result);
});

// Deterministic Financial & Business Calculations
app.post('/api/ai/calculate-financial', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { items, taxRatePercent, discountPercent } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Items array is required for financial calculations.' });
  }

  const calculation = calculateBusinessDocument(items, Number(taxRatePercent) || 0, Number(discountPercent) || 0);
  res.json({ success: true, calculation });
});

// Provider Status Check
app.get('/api/ai/providers-status', (req: Request, res: Response) => {
  const status = getAIProviderStatus();
  res.json(status);
});

// ==========================================
// PROJECTS & WORKSPACE
// ==========================================

app.get('/api/projects', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const raw = db.getRawData();
  const userProjects = raw.projects.filter(p => p.user_id === req.user.id);
  res.json({ projects: userProjects });
});

app.post('/api/projects', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { title, description, category, tags } = req.body;
  if (!title) return res.status(400).json({ error: 'Project title is required.' });

  const raw = db.getRawData();
  const newProj = {
    id: 'proj_' + Math.random().toString(36).substring(2, 10),
    user_id: req.user.id,
    title,
    description: description || '',
    category: category || 'General',
    tags: Array.isArray(tags) ? tags : [],
    is_pinned: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  raw.projects.unshift(newProj);
  db.save();
  res.status(201).json({ project: newProj });
});

app.delete('/api/projects/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const raw = db.getRawData();
  const index = raw.projects.findIndex(p => p.id === req.params.id && p.user_id === req.user.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found or unauthorized.' });

  raw.projects.splice(index, 1);
  raw.project_files = raw.project_files.filter(f => f.project_id !== req.params.id);
  db.save();
  res.json({ success: true, message: 'Project deleted.' });
});

// ==========================================
// CHATBOTS & KNOWLEDGE BASE
// ==========================================

app.get('/api/chatbots', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const raw = db.getRawData();
  const userChatbots = raw.chatbots.filter(b => b.user_id === req.user.id);
  const userKnowledge = raw.chatbot_knowledge;
  
  const enriched = userChatbots.map(bot => ({
    ...bot,
    knowledgeCount: userKnowledge.filter(k => k.chatbot_id === bot.id).length
  }));

  res.json({ chatbots: enriched });
});

app.post('/api/chatbots', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { name, systemPrompt, welcomeMessage, primaryColor } = req.body;
  if (!name) return res.status(400).json({ error: 'Chatbot name is required.' });

  const raw = db.getRawData();
  const newBot = {
    id: 'bot_' + Math.random().toString(36).substring(2, 10),
    user_id: req.user.id,
    name,
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80',
    system_prompt: systemPrompt || 'You are a helpful customer concierge for NEXORA AI.',
    welcome_message: welcomeMessage || 'Hello! How can I assist you today?',
    primary_color: primaryColor || '#8B5CF6',
    is_active: true,
    leads_collected: 0,
    created_at: new Date().toISOString()
  };

  raw.chatbots.unshift(newBot);
  db.save();
  res.status(201).json({ chatbot: newBot });
});

app.post('/api/chatbots/:id/knowledge', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { title, content, type } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Knowledge title and content required.' });

  const raw = db.getRawData();
  const bot = raw.chatbots.find(b => b.id === req.params.id && b.user_id === req.user.id);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found.' });

  const item = {
    id: 'ck_' + Math.random().toString(36).substring(2, 10),
    chatbot_id: bot.id,
    title,
    content,
    type: type || 'doc',
    created_at: new Date().toISOString()
  };
  raw.chatbot_knowledge.push(item);
  db.save();
  res.status(201).json({ knowledgeItem: item });
});

// Live Chatbot interaction endpoint (used by simulator & embedded widget)
app.post('/api/chatbots/:id/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required.' });

  const raw = db.getRawData();
  const bot = raw.chatbots.find(b => b.id === req.params.id);
  if (!bot) return res.status(404).json({ error: 'Chatbot not found.' });

  const knowledge = raw.chatbot_knowledge.filter(k => k.chatbot_id === bot.id);
  const knowledgeContext = knowledge.map(k => `[${k.title}]: ${k.content}`).join('\n\n');

  // Anonymous or owner execution
  const botOwnerId = bot.user_id;
  const result = await executeStudioAI({
    userId: botOwnerId,
    studio: 'chatbot',
    tool: 'Customer Interaction',
    prompt: message,
    parameters: {
      systemPrompt: bot.system_prompt,
      knowledgeContext,
      history: history || []
    },
    creditCost: 1
  });

  res.json({
    reply: result.output || 'I apologize, I am temporarily unavailable. Please try again soon.',
    success: result.success
  });
});

// ==========================================
// BILLING & SUBSCRIPTIONS
// ==========================================

app.get('/api/billing/plans', (req: Request, res: Response) => {
  res.json({ plans: db.getRawData().subscription_plans });
});

app.get('/api/billing/subscription', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const info = db.getSubscription(req.user.id);
  const invoices = db.getRawData().invoices.filter(i => i.user_id === req.user.id);
  res.json({
    ...info,
    invoices
  });
});

app.post('/api/billing/checkout-session', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { planTier } = req.body;
  if (!['free', 'starter', 'pro', 'business'].includes(planTier)) {
    return res.status(400).json({ error: 'Invalid plan tier.' });
  }

  // Update subscription in sandbox/test mode
  const updated = db.updateSubscription(req.user.id, planTier);
  res.json({
    success: true,
    message: `Subscription updated to ${planTier.toUpperCase()} plan (Sandbox Mode).`,
    updated
  });
});

app.post('/api/billing/cancel', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const raw = db.getRawData();
  const sub = raw.subscriptions.find(s => s.user_id === req.user.id);
  if (!sub) return res.status(404).json({ error: 'No active subscription found.' });

  sub.cancel_at_period_end = true;
  db.save();
  res.json({ success: true, message: 'Subscription will cancel at current period end.' });
});

// ==========================================
// ADMIN DASHBOARD
// ==========================================

app.get('/api/admin/metrics', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const raw = db.getRawData();

  const totalUsers = raw.profiles.length;
  const activeUsers = raw.profiles.length;
  const totalGenerations = raw.ai_generations.length;
  const totalCreditsUsed = raw.credit_transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const planCounts = {
    free: raw.subscriptions.filter(s => s.plan_id === 'plan_free').length,
    starter: raw.subscriptions.filter(s => s.plan_id === 'plan_starter').length,
    pro: raw.subscriptions.filter(s => s.plan_id === 'plan_pro').length,
    business: raw.subscriptions.filter(s => s.plan_id === 'plan_business').length
  };

  const revenue = raw.invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + Number(i.amount), 0);

  res.json({
    platformOwner: {
      fullName: 'Asad Ali Awan',
      workspace: 'NEXORA AI',
      role: 'Admin',
      plan: 'Pro Plan'
    },
    totalUsers,
    activeUsers,
    totalGenerations,
    totalCreditsUsed,
    planCounts,
    revenue,
    recentGenerations: raw.ai_generations.slice(0, 10),
    usageLogs: raw.ai_usage_logs.slice(0, 10),
    providers: getAIProviderStatus()
  });
});

app.get('/api/admin/users', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const raw = db.getRawData();
  const enrichedUsers = raw.profiles.map(p => {
    const cb = raw.credit_balances.find(c => c.user_id === p.id);
    const sub = raw.subscriptions.find(s => s.user_id === p.id);
    return {
      id: p.id,
      email: p.email,
      fullName: p.full_name,
      role: p.role,
      balance: cb ? cb.balance : 0,
      planId: sub ? sub.plan_id : 'plan_free',
      createdAt: p.created_at
    };
  });

  res.json({ users: enrichedUsers });
});

app.post('/api/admin/adjust-credits', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { targetUserId, amount, reason } = req.body;
  if (!targetUserId || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Target user ID and numeric credit adjustment amount required.' });
  }

  const newBalance = db.adjustCreditsAdmin(targetUserId, amount, reason || 'Manual Admin adjustment', req.user.id);
  res.json({ success: true, newBalance });
});

app.get('/api/admin/audit-logs', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({ auditLogs: db.getRawData().audit_logs.slice(0, 50) });
});

app.get('/api/admin/settings', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  res.json({ settings: db.getRawData().admin_settings });
});

app.post('/api/admin/settings', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { key, value } = req.body;
  const raw = db.getRawData();
  const setting = raw.admin_settings.find(s => s.key === key);
  if (setting) {
    setting.value = value;
    setting.updated_at = new Date().toISOString();
  } else {
    raw.admin_settings.push({
      key,
      value,
      description: 'Custom configuration',
      updated_at: new Date().toISOString()
    });
  }
  db.save();
  res.json({ success: true, settings: raw.admin_settings });
});

// ==========================================
// BLOG & SUPPORT
// ==========================================

app.get('/api/blog/posts', (req: Request, res: Response) => {
  res.json({ posts: db.getRawData().blog_posts });
});

app.post('/api/support/tickets', (req: Request, res: Response) => {
  const { email, subject, message, priority } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message are required.' });
  }

  const raw = db.getRawData();
  const ticket = {
    id: 'tkt_' + Math.random().toString(36).substring(2, 10),
    user_id: email || 'anonymous_guest',
    subject,
    message,
    priority: priority || 'normal',
    status: 'open' as const,
    created_at: new Date().toISOString()
  };

  raw.support_tickets.unshift(ticket);
  db.save();

  res.status(201).json({
    success: true,
    message: 'Support ticket received. Our customer engineering team will review it promptly.',
    ticket
  });
});

// ==========================================
// VITE DEV SERVER / STATIC ASSETS
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`>>> NEXORA AI SaaS server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
