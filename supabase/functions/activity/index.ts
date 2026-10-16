import { withSupabase } from "npm:@supabase/server@1";

const allowedEvents = new Set([
  "consent_accepted",
  "consent_declined",
  "retry_clicked",
  "not_now_clicked",
  "calendar_add_clicked",
  "calendar_reminder_created",
  "activity_refresh_clicked",
  "signed_in",
  "account_created",
  "signed_out"
]);

export default {
  fetch: withSupabase({ auth: "user" }, async (request, { supabase, userClaims }) => {
    if (request.method === "POST") {
      let body: { event?: unknown };
      try {
        body = await request.json();
      } catch {
        return Response.json({ error: "Invalid JSON body." }, { status: 400 });
      }

      if (typeof body.event !== "string" || !allowedEvents.has(body.event)) {
        return Response.json({ error: "Unsupported activity event." }, { status: 400 });
      }

      const { error } = await supabase.from("user_activity").insert({
        user_id: userClaims.id,
        event: body.event
      });

      if (error) {
        return Response.json({ error: "Could not record activity." }, { status: 500 });
      }

      return Response.json({ recorded: true }, { status: 201 });
    }

    if (request.method === "GET") {
      const { data: role, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userClaims.id)
        .maybeSingle();

      if (roleError) {
        return Response.json({ error: "Could not verify admin access." }, { status: 500 });
      }

      if (role?.role !== "admin") {
        return Response.json({ error: "Admin access required." }, { status: 403 });
      }

      const { data, error } = await supabase
        .from("user_activity")
        .select("user_id, event, created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        return Response.json({ error: "Could not load activity." }, { status: 500 });
      }

      return Response.json({ events: data });
    }

    return Response.json({ error: "Method not allowed." }, { status: 405 });
  })
};