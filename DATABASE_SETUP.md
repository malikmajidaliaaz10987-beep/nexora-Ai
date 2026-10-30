# NEXORA AI — Database Architecture & Setup Guide

NEXORA AI features a normalized 25-table relational schema designed for PostgreSQL and Supabase, with complete Row Level Security (RLS) enforcement.

---

## 1. Schema Overview (25 Tables)

1. `profiles`: User accounts, emails, hashed credentials, avatar, and roles.
2. `user_roles`: Role history and grant records (Visitor, Free, Starter, Pro, Business, Admin).
3. `subscription_plans`: Plan configuration ($0 Free, $9 Starter, $19 Pro, $39 Business).
4. `subscriptions`: Active subscriptions, billing periods, and cancellation status.
5. `credit_balances`: Server-authoritative balances, daily limits, and monthly allocations.
6. `credit_transactions`: Immutable audit ledger for every deduction, grant, and refund.
7. `ai_generations`: Completed generative outputs with prompts, parameters, and credit costs.
8. `ai_usage_logs`: Telemetry logs with token counts, latency in milliseconds, and provider status.
9. `projects`: User workspace folders and project containers.
10. `project_files`: Stored files, markdown documents, and exports.
11. `chatbots`: Custom chatbots with persona prompts, welcome messages, and colors.
12. `chatbot_knowledge`: Ingested FAQs and document text grounding the chatbot.
13. `chatbot_conversations`: Visitor chat sessions and lead capture information.
14. `chatbot_messages`: Chat histories between users and chatbots.
15. `invoices`: Payment receipts with invoice numbers, amounts, and statuses.
16. `payment_events`: Webhook event payloads (Lemon Squeezy, Paddle, Stripe).
17. `notifications`: In-app system alerts and credit notifications.
18. `support_tickets`: Customer support tickets with priority and resolution status.
19. `blog_posts`: Content marketing and AI productivity articles.
20. `referrals`: User referral tracking.
21. `affiliate_commissions`: Affiliate reward accounting.
22. `feedback`: Studio rating and customer feedback.
23. `api_keys`: Developer API keys for mobile and external integrations.
24. `audit_logs`: Security audit trail for administrator and system actions.
25. `admin_settings`: Global feature flags, maintenance mode, and model selections.

---

## 2. Deploying to Supabase / PostgreSQL

1. Open your Supabase or PostgreSQL SQL Editor.
2. Execute the migration file located at:
   ```
   database/001_initial_schema.sql
   ```
3. Set your environment variables in `.env`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```
4. Verify Row Level Security is active for `profiles`, `projects`, `chatbots`, and `credit_balances`.
