# Bree letter

This is a static page with no user or admin login. The note stays behind the Yes/No choice.

## Supabase setup

1. Run `supabase-setup.sql` in the Supabase SQL Editor to create/update the activity table and its row-level security policies.
2. Deploy the Edge Function as described below.
3. Deploy `index.html` to your web host. Set its URL as the website origin allowed by your deployment's CORS configuration if you restrict origins.

The page sends only a fixed event name and a random, temporary browser-session ID. It does not send account details, email addresses, passwords, or the chosen call date/time. The ID resets with the browser session. Activity records are not tamper-proof audit logs and may be submitted directly by visitors.

Review records in the Supabase Dashboard's `public.user_activity` table. New anonymous entries have a null `user_id` and a `visitor_id`; existing authenticated records remain unchanged.

## Activity Edge Function

`supabase/functions/activity/index.ts` imports `@supabase/server` directly for the Supabase Edge Runtime. No local npm installation is needed. The function uses the platform-injected Supabase URL and publishable key; it does not require a secret key.

Deploy the SQL in `supabase-setup.sql`, then deploy the function with the Supabase CLI:

```sh
supabase functions deploy activity --project-ref zpbmoghnpykbnitxeuju
```

Keep secret keys out of the repository and browser. A database password and privileged Supabase keys were exposed during setup; rotate them in Supabase before using them anywhere.