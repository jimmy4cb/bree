import { withSupabase } from "npm:@supabase/server@1";

const allowedEvents = new Set([
  "consent_accepted",
  "consent_declined",
  "calendar_add_clicked",
  "calendar_reminder_created"
]);

export default {
  fetch: withSupabase({ auth: "publishable" }, async (request, { supabase }) => {
    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed." }, { status: 405 });
    }

    let body: { event?: unknown; visitor_id?: unknown };
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    if (typeof body.event !== "string" || !allowedEvents.has(body.event)) {
      return Response.json({ error: "Unsupported activity event." }, { status: 400 });
    }

    if (typeof body.visitor_id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.visitor_id)) {
      return Response.json({ error: "Invalid visitor ID." }, { status: 400 });
    }

    const { error } = await supabase.from("user_activity").insert({
      user_id: null,
      visitor_id: body.visitor_id,
      event: body.event
    });

    if (error) {
      return Response.json({ error: "Could not record activity." }, { status: 500 });
    }

    return Response.json({ recorded: true }, { status: 201 });
  })
};