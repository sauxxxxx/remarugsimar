/**
 * Portfolio contact form → your Gmail inbox (and, optionally, a Google Sheet log).
 *
 * Paste this into a new project at https://script.google.com, set the script properties,
 * and deploy it as a web app. See docs/contact-form-setup.md for the steps.
 *
 * Script properties (Project Settings → Script properties):
 *   SHARED_SECRET  Required. The same value as CONTACT_APPS_SCRIPT_SECRET on the website.
 *   SHEET_ID       Optional. A Google Sheet to log every enquiry in (the ID from its URL).
 */

const LIMITS = { name: 100, email: 200, message: 5000, context: 200, page: 300 };

function doPost(e) {
  const props = PropertiesService.getScriptProperties();
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (error) {
    return reply({ ok: false, error: "bad-request" });
  }

  // Only the website's server knows the secret, so direct calls to this URL are ignored.
  const secret = props.getProperty("SHARED_SECRET");
  if (!secret || data.secret !== secret) return reply({ ok: false, error: "unauthorised" });

  const enquiry = {};
  for (const key of Object.keys(LIMITS)) enquiry[key] = String(data[key] || "").trim().slice(0, LIMITS[key]);
  if (!enquiry.name || !enquiry.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    return reply({ ok: false, error: "invalid" });
  }

  const owner = Session.getEffectiveUser().getEmail();
  const about = enquiry.context ? ` (${enquiry.context})` : "";
  const details = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    enquiry.context && `About: ${enquiry.context}`,
    enquiry.page && `Sent from: ${enquiry.page}`,
  ].filter(Boolean);
  const lines = [...details, "", ...enquiry.message.split("\n")];

  // Reply-To is the visitor, so pressing Reply in Gmail answers them directly.
  MailApp.sendEmail({
    to: owner,
    replyTo: enquiry.email,
    name: "Portfolio contact form",
    subject: `New enquiry from ${enquiry.name}${about}`,
    body: lines.join("\n"),
    htmlBody: lines.map((line) => escapeHtml(line) || "&nbsp;").join("<br>"),
  });

  const sheetId = props.getProperty("SHEET_ID");
  if (sheetId) {
    SpreadsheetApp.openById(sheetId).getSheets()[0].appendRow([
      new Date(), enquiry.name, enquiry.email, enquiry.context, enquiry.message, enquiry.page,
    ]);
  }

  return reply({ ok: true });
}

// Visiting the web app URL in a browser shows this, which confirms the deployment works.
function doGet() {
  return reply({ ok: true, service: "portfolio-contact" });
}

function reply(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
