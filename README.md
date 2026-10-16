# Bree letter

This is a static page. User accounts and the protected admin route use Supabase Auth.

## Supabase setup

1. Create a Supabase project and enable email/password sign-in.
2. Add the deployed page URL to the Supabase site URL and redirect URL settings.
3. In `index.html`, set `supabaseUrl` and `supabasePublishableKey` to the project's URL and publishable key. Do not put a service-role key in the page.
4. Create the admin account using `clii@jijengeyouth.org`, then run `supabase-setup.sql` in the Supabase SQL Editor. The script creates user roles, restricts role reads with row-level security, and promotes that existing account to admin.
5. Deploy `index.html`. Visitors can sign in or create an account. The admin sign-in is at `index.html#admin` and is not linked from the public page.

New accounts receive the `user` role automatically. The admin route checks the role table; hiding the route is only a navigation choice, not an access control. Protect any future admin data or actions with server-side authorization and row-level security too.

The admin activity list shows the latest 100 recorded actions with a timestamp and user ID. It records sign-ins, account creation, consent choices, retry/not-now choices, calendar actions, and sign-out. Passwords and form values are never recorded. The page tells users that activity is recorded. Browser-recorded clicks are not tamper-proof security audit events; use a trusted server function for compliance-grade auditing.

## Activity Edge Function

`supabase/functions/activity/index.ts` imports `@supabase/server` directly for the Supabase Edge Runtime. No local npm installation is needed. The function uses the platform-injected Supabase URL, publishable key, and JWKS; it does not require the secret key because requests use the caller's RLS-scoped client.

Deploy the SQL in `supabase-setup.sql`, then deploy the function with the Supabase CLI:

```sh
supabase functions deploy activity --project-ref zpbmoghnpykbnitxeuju
```

Deploy `index.html` to a web host and use its public URL in Supabase Auth's site and redirect URL settings. Keep secret keys out of the repository and browser. A secret key was pasted into chat during setup; rotate it in Supabase before using it anywhere.