/**
 * NEXORA AI — Frontend Types & Interfaces
 */

export type UserRole = 'visitor' | 'free' | 'starter' | 'pro' | 'business' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: UserRole;
  company?: string;
  bio?: string;
  createdAt?: string;
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

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  balance_after: number;
  type: string;
  description: string;
  tool_id?: string;
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
  knowledgeCount?: number;
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

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export interface ProviderStatus {
  provider: string;
  model?: string;
  configured: boolean;
  status: string;
  capabilities: string[];
}

export type ActivePage =
  | 'home'
  | 'explore'
  | 'studio-writing'
  | 'studio-image'
  | 'studio-video'
  | 'studio-document'
  | 'studio-chatbot'
  | 'studio-marketing'
  | 'studio-business'
  | 'pricing'
  | 'about'
  | 'contact'
  | 'blog'
  | 'help'
  | 'auth'
  | 'dashboard'
  | 'projects'
  | 'billing'
  | 'settings'
  | 'admin'
  | 'legal-privacy'
  | 'legal-terms'
  | 'legal-cookies'
  | 'legal-refund'
  | 'legal-acceptable-use';
