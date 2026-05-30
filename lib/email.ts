import { Resend } from "resend";

export const COUPLE_EMAILS = ["mavurukuda@gmail.com"];

export async function sendEmail({ to, subject, html }: { to: string[]; subject: string; html: string }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    from: "Kuda & Maxine Wedding <wedding@resend.dev>",
    to,
    subject,
    html,
  });
}

export function emailBase(content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF8F4;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <p style="color:#9BAA7F;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px;">Wedding Planner</p>
      <h1 style="color:#344C3D;font-size:28px;font-weight:400;margin:0;">Kudakwashe & Maxine</h1>
      <p style="color:#9AA796;font-size:12px;letter-spacing:2px;margin:4px 0 0;">28 · 08 · 2027</p>
      <div style="height:1px;background:#B7CFB5;margin:24px 0;opacity:0.4;"></div>
    </div>
    ${content}
    <div style="text-align:center;margin-top:40px;padding-top:24px;border-top:1px solid #B7CFB5;">
      <p style="color:#9AA796;font-size:11px;">✿ Sent from your Wedding Planner ✿</p>
    </div>
  </div>
</body>
</html>`;
}
