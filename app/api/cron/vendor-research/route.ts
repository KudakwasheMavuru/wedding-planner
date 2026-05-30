import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendEmail, emailBase, COUPLE_EMAILS } from "@/lib/email";

// Vendor categories to rotate through — 2 categories per day
const CATEGORIES = [
  "Wedding Photographer", "Wedding Videographer", "Wedding Venue",
  "Wedding Caterer", "Wedding Florist", "Wedding DJ",
  "Wedding Hair and Makeup", "Wedding Cake Baker",
  "Wedding Officiant", "Wedding Transportation",
  "Wedding Planner Coordinator", "Wedding Stationery",
];

function todaysCategories(): string[] {
  const dayIndex = Math.floor(Date.now() / 86400000) % Math.ceil(CATEGORIES.length / 2);
  return CATEGORIES.slice(dayIndex * 2, dayIndex * 2 + 2);
}

async function searchVendors(category: string): Promise<VendorResult[]> {
  const query = `${category} Zimbabwe Harare Bulawayo 2024 2025 contact`;
  const url = `https://api.apify.com/v2/acts/apify~rag-web-browser/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      maxResults: 5,
      outputFormats: ["markdown"],
    }),
  });

  if (!res.ok) return [];

  const data = await res.json();
  const results: VendorResult[] = [];

  for (const item of data.slice(0, 3)) {
    const text = item.markdown || item.text || "";
    const urlStr = item.url || "";

    // Extract a name from the URL or title
    const name = item.metadata?.title || extractName(urlStr, category);
    if (!name || name.length < 3) continue;

    results.push({
      id: crypto.randomUUID(),
      category: category.replace("Wedding ", ""),
      name,
      description: text.slice(0, 300).replace(/\n+/g, " ").trim(),
      website: urlStr,
      instagram: extractInstagram(text),
      phone: extractPhone(text),
      source: urlStr,
      approved: false,
    });
  }

  return results;
}

function extractName(url: string, fallback: string): string {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    const parts = hostname.split(".");
    return parts[0].replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  } catch {
    return fallback;
  }
}

function extractInstagram(text: string): string {
  const match = text.match(/@([\w.]+)/);
  return match ? `@${match[1]}` : "";
}

function extractPhone(text: string): string {
  const match = text.match(/(\+?263[\s-]?\d[\d\s-]{7,}|\+?07\d[\d\s-]{7,})/);
  return match ? match[0].trim() : "";
}

type VendorResult = {
  id: string; category: string; name: string; description: string;
  website: string; instagram: string; phone: string; source: string; approved: boolean;
};

function vendorCard(v: VendorResult, baseUrl: string) {
  const approveUrl = `${baseUrl}/api/approve-vendor?id=${v.id}`;
  return `
<div style="background:white;border-radius:16px;padding:24px;margin-bottom:16px;border-left:4px solid #9BAA7F;">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
    <div>
      <span style="background:#B7CFB5;color:#344C3D;font-size:10px;padding:3px 10px;border-radius:20px;letter-spacing:1px;text-transform:uppercase;">${v.category}</span>
      <h3 style="color:#344C3D;font-size:18px;font-weight:400;margin:8px 0 4px;">${v.name}</h3>
    </div>
  </div>
  <p style="color:#606C46;font-size:13px;line-height:1.6;margin:0 0 12px;">${v.description || "No description available."}</p>
  <div style="font-size:12px;color:#9AA796;margin-bottom:16px;">
    ${v.phone ? `📞 ${v.phone}<br>` : ""}
    ${v.instagram ? `📸 ${v.instagram}<br>` : ""}
    ${v.website ? `🔗 <a href="${v.website}" style="color:#606C46;">${v.website.slice(0, 50)}</a>` : ""}
  </div>
  <a href="${approveUrl}" style="display:inline-block;background:#405335;color:white;padding:10px 24px;border-radius:12px;text-decoration:none;font-size:13px;letter-spacing:0.5px;">
    ✓ Add to Vendors List
  </a>
</div>`;
}

export async function GET(request: Request) {
  // Verify this is called by Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = todaysCategories();
  const allVendors: VendorResult[] = [];

  for (const cat of categories) {
    const vendors = await searchVendors(cat);
    allVendors.push(...vendors);
  }

  if (allVendors.length === 0) {
    return NextResponse.json({ message: "No vendors found today" });
  }

  // Store suggestions in Supabase
  await supabase.from("vendor_suggestions").insert(allVendors);

  // Build email
  const baseUrl = process.env.NEXTAUTH_URL || "https://wedding-planner-teal-one.vercel.app";
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  const html = emailBase(`
    <h2 style="color:#344C3D;font-size:20px;font-weight:400;margin:0 0 8px;">Today's Vendor Suggestions</h2>
    <p style="color:#9AA796;font-size:13px;margin:0 0 24px;">${today} · ${allVendors.length} vendors found in Zimbabwe</p>
    <p style="color:#606C46;font-size:13px;margin:0 0 24px;">
      We searched across the web for the best <strong>${categories.join(" & ")}</strong> vendors in Zimbabwe.
      Click <strong>"Add to Vendors List"</strong> on any you'd like to save.
    </p>
    ${allVendors.map(v => vendorCard(v, baseUrl)).join("")}
  `);

  await sendEmail({
    to: COUPLE_EMAILS,
    subject: `🌿 ${allVendors.length} New Vendor Suggestions — ${categories.join(" & ")}`,
    html,
  });

  return NextResponse.json({ sent: allVendors.length, categories });
}
