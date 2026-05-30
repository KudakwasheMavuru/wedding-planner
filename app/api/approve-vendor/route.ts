import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  // Fetch the suggestion
  const { data: suggestion } = await supabase
    .from("vendor_suggestions")
    .select("*")
    .eq("id", id)
    .single();

  if (!suggestion) {
    return new Response(alreadyHtml("This vendor suggestion was not found or has already been added."), {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Add to vendors table
  const vendorId = Math.random().toString(36).slice(2, 10);
  await supabase.from("vendors").insert({
    id: vendorId,
    category: suggestion.category,
    "vendorName": suggestion.name,
    "contactPerson": "",
    phone: suggestion.phone || "",
    email: "",
    website: suggestion.website || "",
    "contractSigned": false,
    "depositPaid": false,
    notes: `${suggestion.description || ""}\n${suggestion.instagram ? `Instagram: ${suggestion.instagram}` : ""}`.trim(),
  });

  // Mark suggestion as approved
  await supabase.from("vendor_suggestions").update({ approved: true }).eq("id", id);

  return new Response(successHtml(suggestion.name, suggestion.category), {
    headers: { "Content-Type": "text/html" },
  });
}

function successHtml(name: string, category: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Vendor Added</title></head>
<body style="margin:0;padding:40px 20px;background:#FAF8F4;font-family:Georgia,serif;text-align:center;">
  <div style="max-width:480px;margin:0 auto;padding:48px 32px;background:white;border-radius:24px;box-shadow:0 4px 24px rgba(64,83,53,0.08);">
    <div style="font-size:48px;margin-bottom:16px;">✿</div>
    <h2 style="color:#344C3D;font-size:24px;font-weight:400;margin:0 0 8px;">${name}</h2>
    <p style="color:#9BAA7F;font-size:13px;letter-spacing:1px;text-transform:uppercase;margin:0 0 16px;">${category}</p>
    <p style="color:#606C46;font-size:15px;margin:0 0 24px;">Successfully added to your vendors list!</p>
    <a href="https://wedding-planner-teal-one.vercel.app/vendors" style="display:inline-block;background:#405335;color:white;padding:12px 28px;border-radius:12px;text-decoration:none;font-size:14px;">
      View Vendors →
    </a>
  </div>
</body></html>`;
}

function alreadyHtml(msg: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Not Found</title></head>
<body style="margin:0;padding:40px 20px;background:#FAF8F4;font-family:Georgia,serif;text-align:center;">
  <div style="max-width:480px;margin:0 auto;padding:48px 32px;background:white;border-radius:24px;">
    <p style="color:#606C46;">${msg}</p>
    <a href="https://wedding-planner-teal-one.vercel.app/vendors" style="color:#405335;">View Vendors →</a>
  </div>
</body></html>`;
}
