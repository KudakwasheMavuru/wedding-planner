import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendEmail, emailBase, COUPLE_EMAILS } from "@/lib/email";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    { data: checklist },
    { data: budget },
    { data: guests },
    { data: vendors },
    { data: timeline },
  ] = await Promise.all([
    supabase.from("checklist").select("*"),
    supabase.from("budget").select("*"),
    supabase.from("guests").select("*"),
    supabase.from("vendors").select("*"),
    supabase.from("timeline").select("*").order("time" as never, { ascending: true }),
  ]);

  const today = new Date();
  const weddingDate = new Date("2027-08-28");
  const daysLeft = Math.ceil((weddingDate.getTime() - today.getTime()) / 86400000);

  // Checklist stats
  const totalTasks = checklist?.length ?? 0;
  const doneTasks = checklist?.filter((t: { completed: boolean }) => t.completed).length ?? 0;
  const pendingTasks = checklist?.filter((t: { completed: boolean; priority: string }) => !t.completed && t.priority === "High").length ?? 0;

  // Budget stats
  const totalBudget = budget?.reduce((s: number, i: { estimatedCost: number }) => s + (i.estimatedCost || 0), 0) ?? 0;
  const totalSpent = budget?.reduce((s: number, i: { actualCost: number }) => s + (i.actualCost || 0), 0) ?? 0;
  const totalDeposits = budget?.reduce((s: number, i: { depositPaid: number }) => s + (i.depositPaid || 0), 0) ?? 0;

  // Guest stats
  const totalGuests = guests?.length ?? 0;
  const accepted = guests?.filter((g: { rsvpStatus: string }) => g.rsvpStatus === "Accepted").length ?? 0;
  const pending = guests?.filter((g: { rsvpStatus: string }) => g.rsvpStatus === "Pending").length ?? 0;

  // Vendor stats
  const totalVendors = vendors?.length ?? 0;
  const signedVendors = vendors?.filter((v: { contractSigned: boolean }) => v.contractSigned).length ?? 0;

  // Upcoming timeline events
  const upcomingEvents = timeline?.slice(0, 5) ?? [];

  // High priority pending tasks
  const urgentTasks = checklist?.filter((t: { completed: boolean; priority: string }) => !t.completed && t.priority === "High").slice(0, 5) ?? [];

  const formatCurrency = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;

  const html = emailBase(`
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-block;background:#344C3D;color:white;padding:12px 28px;border-radius:20px;">
        <p style="margin:0;font-size:13px;letter-spacing:2px;opacity:0.7;">DAYS TO THE WEDDING</p>
        <p style="margin:4px 0 0;font-size:48px;font-weight:400;">${daysLeft}</p>
      </div>
    </div>

    <h2 style="color:#344C3D;font-size:20px;font-weight:400;margin:0 0 24px;">Weekly Planner Summary</h2>

    <!-- Checklist -->
    <div style="background:white;border-radius:16px;padding:24px;margin-bottom:16px;border-left:4px solid #9BAA7F;">
      <h3 style="color:#344C3D;font-size:15px;font-weight:400;margin:0 0 16px;">✓ Checklist</h3>
      <div style="display:flex;gap:24px;flex-wrap:wrap;">
        <div><p style="font-size:28px;color:#344C3D;margin:0;">${doneTasks}/${totalTasks}</p><p style="font-size:11px;color:#9AA796;margin:4px 0 0;letter-spacing:1px;">TASKS DONE</p></div>
        <div><p style="font-size:28px;color:#c0392b;margin:0;">${pendingTasks}</p><p style="font-size:11px;color:#9AA796;margin:4px 0 0;letter-spacing:1px;">HIGH PRIORITY LEFT</p></div>
      </div>
      ${urgentTasks.length > 0 ? `
      <div style="margin-top:16px;border-top:1px solid #F0EDE6;padding-top:16px;">
        <p style="font-size:11px;color:#9AA796;letter-spacing:1px;margin:0 0 8px;">URGENT</p>
        ${urgentTasks.map((t: { task: string; category: string }) => `<p style="font-size:13px;color:#606C46;margin:4px 0;">• ${t.task} <span style="color:#9AA796;">(${t.category})</span></p>`).join("")}
      </div>` : ""}
    </div>

    <!-- Budget -->
    <div style="background:white;border-radius:16px;padding:24px;margin-bottom:16px;border-left:4px solid #B7CFB5;">
      <h3 style="color:#344C3D;font-size:15px;font-weight:400;margin:0 0 16px;">💰 Budget</h3>
      <div style="display:flex;gap:24px;flex-wrap:wrap;">
        <div><p style="font-size:22px;color:#344C3D;margin:0;">${formatCurrency(totalBudget)}</p><p style="font-size:11px;color:#9AA796;margin:4px 0 0;letter-spacing:1px;">TOTAL BUDGET</p></div>
        <div><p style="font-size:22px;color:#606C46;margin:0;">${formatCurrency(totalSpent)}</p><p style="font-size:11px;color:#9AA796;margin:4px 0 0;letter-spacing:1px;">ACTUAL SPEND</p></div>
        <div><p style="font-size:22px;color:#9BAA7F;margin:0;">${formatCurrency(totalDeposits)}</p><p style="font-size:11px;color:#9AA796;margin:4px 0 0;letter-spacing:1px;">DEPOSITS PAID</p></div>
      </div>
      <div style="margin-top:16px;background:#F0EDE6;border-radius:8px;height:8px;overflow:hidden;">
        <div style="background:#405335;height:100%;width:${Math.min(100, totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0)}%;border-radius:8px;"></div>
      </div>
      <p style="font-size:11px;color:#9AA796;margin:6px 0 0;">${totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% of budget used</p>
    </div>

    <!-- Guests -->
    <div style="background:white;border-radius:16px;padding:24px;margin-bottom:16px;border-left:4px solid #C8D9C4;">
      <h3 style="color:#344C3D;font-size:15px;font-weight:400;margin:0 0 16px;">👥 Guests</h3>
      <div style="display:flex;gap:24px;flex-wrap:wrap;">
        <div><p style="font-size:28px;color:#344C3D;margin:0;">${totalGuests}</p><p style="font-size:11px;color:#9AA796;margin:4px 0 0;letter-spacing:1px;">INVITED</p></div>
        <div><p style="font-size:28px;color:#405335;margin:0;">${accepted}</p><p style="font-size:11px;color:#9AA796;margin:4px 0 0;letter-spacing:1px;">ACCEPTED</p></div>
        <div><p style="font-size:28px;color:#9BAA7F;margin:0;">${pending}</p><p style="font-size:11px;color:#9AA796;margin:4px 0 0;letter-spacing:1px;">PENDING</p></div>
      </div>
    </div>

    <!-- Vendors -->
    <div style="background:white;border-radius:16px;padding:24px;margin-bottom:24px;border-left:4px solid #9BAA7F;">
      <h3 style="color:#344C3D;font-size:15px;font-weight:400;margin:0 0 16px;">🌿 Vendors</h3>
      <div style="display:flex;gap:24px;flex-wrap:wrap;">
        <div><p style="font-size:28px;color:#344C3D;margin:0;">${totalVendors}</p><p style="font-size:11px;color:#9AA796;margin:4px 0 0;letter-spacing:1px;">TOTAL</p></div>
        <div><p style="font-size:28px;color:#405335;margin:0;">${signedVendors}</p><p style="font-size:11px;color:#9AA796;margin:4px 0 0;letter-spacing:1px;">CONTRACTS SIGNED</p></div>
        <div><p style="font-size:28px;color:#c0392b;margin:0;">${totalVendors - signedVendors}</p><p style="font-size:11px;color:#9AA796;margin:4px 0 0;letter-spacing:1px;">UNSIGNED</p></div>
      </div>
    </div>

    ${upcomingEvents.length > 0 ? `
    <!-- Day-of Timeline Preview -->
    <div style="background:white;border-radius:16px;padding:24px;margin-bottom:24px;">
      <h3 style="color:#344C3D;font-size:15px;font-weight:400;margin:0 0 16px;">🕐 Day-Of Timeline (first ${upcomingEvents.length} events)</h3>
      ${upcomingEvents.map((e: { time: string; event: string; location: string }) => `
        <div style="display:flex;gap:16px;padding:8px 0;border-bottom:1px solid #F0EDE6;">
          <span style="font-size:12px;color:#9BAA7F;width:48px;flex-shrink:0;">${e.time || "—"}</span>
          <span style="font-size:13px;color:#344C3D;">${e.event}${e.location ? ` <span style="color:#9AA796;">· ${e.location}</span>` : ""}</span>
        </div>`).join("")}
    </div>` : ""}

    <div style="text-align:center;">
      <a href="https://wedding-planner-teal-one.vercel.app" style="display:inline-block;background:#405335;color:white;padding:12px 32px;border-radius:12px;text-decoration:none;font-size:14px;">
        Open Wedding Planner →
      </a>
    </div>
  `);

  await sendEmail({
    to: COUPLE_EMAILS,
    subject: `🌿 Weekly Wedding Summary — ${daysLeft} days to go`,
    html,
  });

  return NextResponse.json({ sent: true, daysLeft });
}
