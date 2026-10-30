-- ====================================================================
-- NEXORA AI — Production PostgreSQL / Supabase Database Architecture
-- Full 25-Table Normalized Schema with Row Level Security (RLS)
-- ====================================================================

-- 1. Profiles (User accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'free' CHECK (role IN ('visitor', 'free', 'starter', 'pro', 'business', 'admin')),
    company TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. User Roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    granted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    granted_by UUID
);

-- 3. Subscription Plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('free', 'starter', 'pro', 'business')),
    price_monthly NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    price_annual NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    credit_limit INT NOT NULL DEFAULT 50,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 4. Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id TEXT REFERENCES public.subscription_plans(id),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    payment_provider TEXT DEFAULT 'none'
);

-- 5. Credit Balances
CREATE TABLE IF NOT EXISTS public.credit_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    balance INT NOT NULL DEFAULT 50,
    daily_limit INT NOT NULL DEFAULT 50,
    monthly_limit INT NOT NULL DEFAULT 1500,
    used_today INT NOT NULL DEFAULT 0,
    last_reset TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 6. Credit Transactions (Audit ledger)
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    balance_after INT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    tool_id TEXT,
    timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 7. AI Generations
CREATE TABLE IF NOT EXISTS public.ai_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    studio TEXT NOT NULL,
    tool TEXT NOT NULL,
    prompt TEXT NOT NULL,
    parameters JSONB DEFAULT '{}'::jsonb,
    output TEXT,
    credits_used INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 8. AI Usage Logs
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    tokens_input INT DEFAULT 0,
    tokens_output INT DEFAULT 0,
    latency_ms INT DEFAULT 0,
    status TEXT NOT NULL,
    error_message TEXT,
    timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 9. Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'General',
    tags TEXT[] DEFAULT '{}',
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 10. Project Files
CREATE TABLE IF NOT EXISTS public.project_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    content TEXT,
    file_type TEXT DEFAULT 'markdown',
    size INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 11. Chatbots
CREATE TABLE IF NOT EXISTS public.chatbots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar TEXT,
    system_prompt TEXT NOT NULL,
    welcome_message TEXT NOT NULL,
    primary_color TEXT DEFAULT '#8B5CF6',
    is_active BOOLEAN DEFAULT true,
    leads_collected INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 12. Chatbot Knowledge
CREATE TABLE IF NOT EXISTS public.chatbot_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatbot_id UUID REFERENCES public.chatbots(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'faq',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 13. Chatbot Conversations
CREATE TABLE IF NOT EXISTS public.chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatbot_id UUID REFERENCES public.chatbots(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    user_name TEXT,
    user_email TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 14. Chatbot Messages
CREATE TABLE IF NOT EXISTS public.chatbot_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.chatbot_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'bot', 'agent')),
    text TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 15. Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'paid',
    invoice_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 16. Payment Events (Webhooks)
CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 17. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 18. Support Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'normal',
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 19. Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    read_time TEXT NOT NULL,
    cover_image TEXT,
    published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 20. Referrals
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    referee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 21. Affiliate Commissions
CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) DEFAULT 0.00,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 22. Feedback
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    studio TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 23. API Keys
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    key_name TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    prefix TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_used TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 24. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    details TEXT NOT NULL,
    ip_address TEXT DEFAULT '127.0.0.1',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 25. Admin Settings
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- User profile access policy
CREATE POLICY user_read_own_profile ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Projects user isolation
CREATE POLICY user_manage_own_projects ON public.projects
    FOR ALL USING (auth.uid() = user_id);

-- Chatbots user isolation
CREATE POLICY user_manage_own_chatbots ON public.chatbots
    FOR ALL USING (auth.uid() = user_id);

-- Credit balances user view only
CREATE POLICY user_view_own_credits ON public.credit_balances
    FOR SELECT USING (auth.uid() = user_id);
