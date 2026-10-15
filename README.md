# Bree letter

This is a static page. User accounts and the protected admin route use Supabase Auth.

## Supabase setup

1. Create a Supabase project and enable email/password sign-in.
2. Add the deployed page URL to the Supabase site URL and redirect URL settings.
3. In `index.html`, set `supabaseUrl` and `supabasePublishableKey` to the project's URL and publishable key. Do not put a service-role key in the page.
4. Create the admin account using `clii@jijengeyouth.org`, then run `supabase-setup.sql` in the Supabase SQL Editor. The script creates user roles, restricts role reads with row-level security, and promotes that existing account to admin.
5. Deploy `index.html`. Visitors can sign in or create an account. The admin sign-in is at `index.html#admin` and is not linked from the public page.

New accounts receive the `user` role automatically. The admin route checks the role table; hiding the route is only a navigation choice, not an access control. Protect any future admin data or actions with server-side authorization and row-level security too.