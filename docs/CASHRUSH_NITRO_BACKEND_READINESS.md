# CASHRUSH NITRO V11 — secure backend readiness

## Active in this prototype
- Email/password sign-up, sign-in, password reset and session persistence are delegated to Supabase Auth over HTTPS.
- Passwords are sent directly to Supabase Auth and are not written to localStorage, game progress, or SQL tables.
- Only the Supabase project URL and public publishable/anon key may be entered in the browser. Never paste a service_role key or secret.
- Player progress is protected by Row Level Security and scoped to the signed-in user.
- The SIM USD practice wallet is not a cash ledger and is never proof of funds.

## $5 starting-deposit concept
The interface shows a proposed first deposit of USD 5.00 as NOT ACTIVE. It is separate from the $5.00 SIM USD practice starting credit. No checkout, deposit, withdrawal, payout, or real-money reward is enabled.

## Required before any real payment
1. Select and verify a payment provider for the intended Kenyan business and currency flow.
2. Frontend requests a checkout session from a server/Cloudflare Worker; the browser never supplies a trusted amount.
3. Server validates the authenticated Supabase user, fixed USD 5.00 product, currency and idempotency key.
4. Verify provider webhook signatures server-side; never trust a browser redirect or success screen.
5. Record immutable transaction/ledger entries with idempotent processing. The client cannot write cash-ledger rows.
6. Implement refunds, chargebacks, fraud controls, reconciliation, support and audit logging.
7. Complete a funded rewards model and Kenyan legal/compliance review before advertising or paying cash rewards. Keep withdrawals disabled until verified.

## Separation
- player_progress.demo_wallet: practice-only; client access is limited by per-user RLS.
- Future payment_transactions and wallet_ledger: server-only writes, no browser write grants or public policies.
- Future endpoints: authenticated checkout creation, signed webhook receiver and read-only balance/history.
- Provider secrets belong only in server environment variables, never in HTML, JavaScript bundles, Git or chat.

## Deployment checklist
- Host on HTTPS.
- Run supabase/cashrush_nitro_schema.sql in the intended Supabase project.
- Enter only the Supabase project URL and public publishable/anon key in the account setup panel.
- Configure Supabase Auth Site URL and Redirect URLs for the deployed origin.
- Test signup, confirmation, login, logout/login persistence, password reset and two-account RLS isolation.
- Keep the $5 deposit button disabled until payment staging and compliance checks pass.
