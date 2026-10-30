/**
 * NEXORA AI — Data Models & Types
 * Complete specification schema representing all 25 tables.
 */

export type UserRole = 'visitor' | 'free' | 'starter' | 'pro' | 'business' | 'admin';

export interface Profile {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  avatar_url: string;
  role: UserRole;
  company?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  granted_at: string;
  granted_by?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'free' | 'starter' | 'pro' | 'business';
  price_monthly: number;
  price_annual: number;
  credit_limit: number;
  features: string[];
  is_active: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  payment_provider?: string;
}

export interface CreditBalance {
  id: string;
  user_id: string;
  balance: number;
  daily_limit: number;
  monthly_limit: number;
  used_today: number;
  last_reset: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  balance_after: number;
  type: 'deduction' | 'grant' | 'refund' | 'subscription_renewal' | 'admin_adjustment';
  description: string;
  tool_id?: string;
  timestamp: string;
}

export interface AIGeneration {
  id: string;
  user_id: string;
  studio: string;
  tool: string;
  prompt: string;
  parameters: Record<string, any>;
  output: string;
  credits_used: number;
  status: 'completed' | 'failed' | 'pending';
  created_at: string;
}

export interface AIUsageLog {
  id: string;
  user_id: string;
  provider: string;
  model: string;
  tokens_input: number;
  tokens_output: number;
  latency_ms: number;
  status: 'success' | 'error';
  error_message?: string;
  timestamp: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  content: string;
  file_type: string;
  size: number;
  created_at: string;
}

export interface Chatbot {
  id: string;
  user_id: string;
  name: string;
  avatar: string;
  system_prompt: string;
  welcome_message: string;
  primary_color: string;
  is_active: boolean;
  leads_collected: number;
  created_at: string;
}

export interface ChatbotKnowledge {
  id: string;
  chatbot_id: string;
  title: string;
  content: string;
  type: 'faq' | 'doc' | 'snippet';
  created_at: string;
}

export interface ChatbotConversation {
  id: string;
  chatbot_id: string;
  session_id: string;
  user_name?: string;
  user_email?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatbotMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'bot' | 'agent';
  text: string;
  timestamp: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  subscription_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  invoice_url: string;
  created_at: string;
}

export interface PaymentEvent {
  id: string;
  provider: string;
  event_type: string;
  payload: any;
  processed: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  is_read: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  read_time: string;
  cover_image: string;
  published_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referee_id: string;
  status: 'pending' | 'completed';
  created_at: string;
}

export interface AffiliateCommission {
  id: string;
  referrer_id: string;
  amount: number;
  status: 'pending' | 'paid';
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  studio: string;
  created_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  key_name: string;
  key_hash: string;
  prefix: string;
  is_active: boolean;
  last_used?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface AdminSetting {
  key: string;
  value: any;
  description: string;
  updated_at: string;
}

export interface DatabaseSchema {
  profiles: Profile[];
  user_roles: UserRoleRecord[];
  subscriptions: Subscription[];
  subscription_plans: SubscriptionPlan[];
  credit_balances: CreditBalance[];
  credit_transactions: CreditTransaction[];
  ai_generations: AIGeneration[];
  ai_usage_logs: AIUsageLog[];
  projects: Project[];
  project_files: ProjectFile[];
  chatbots: Chatbot[];
  chatbot_knowledge: ChatbotKnowledge[];
  chatbot_conversations: ChatbotConversation[];
  chatbot_messages: ChatbotMessage[];
  invoices: Invoice[];
  payment_events: PaymentEvent[];
  notifications: Notification[];
  support_tickets: SupportTicket[];
  blog_posts: BlogPost[];
  referrals: Referral[];
  affiliate_commissions: AffiliateCommission[];
  feedback: Feedback[];
  api_keys: ApiKey[];
  audit_logs: AuditLog[];
  admin_settings: AdminSetting[];
}
