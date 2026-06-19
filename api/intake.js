const OWNER_EMAIL = "me@ayodev.tech";
const FROM_EMAIL = "Ayodev.tech <amin@ayodev.tech>";

const labels = {
  date: "Date",
  projectCode: "Project code / ID",
  clientName: "Client full name",
  brandName: "Business / brand name",
  email: "Client email",
  phone: "Phone number",
  contactMethod: "Preferred contact method",
  referredBy: "Referred by",
  role: "Profession / role",
  industry: "Industry / niche",
  bio: "Short bio",
  location: "Location",
  profilePhoto: "Profile photo available",
  websitePurpose: "Purpose of website",
  primaryGoal: "Primary goal",
  targetAudience: "Target audience",
  inspiration: "Competitors / inspiration",
  dislikes: "Sites or styles to avoid",
  successMetric: "Success measure",
  pages: "Pages / sections needed",
  workSamples: "Portfolio / work samples",
  projectDescriptions: "Project descriptions",
  testimonials: "Testimonials",
  contentReadiness: "Content readiness",
  clientLogos: "Client logos to show",
  resume: "Downloadable CV / resume",
  logo: "Logo available",
  brandColors: "Brand colors",
  fonts: "Preferred fonts",
  vibe: "Overall vibe",
  colorMode: "Dark or light mode",
  styleGuide: "Existing style guide",
  referenceWebsites: "Reference websites",
  domain: "Domain name",
  cms: "CMS required",
  contactForm: "Contact form",
  booking: "Booking / scheduling",
  socialLinks: "Social media links",
  integrations: "Other integrations",
  access: "Accounts or access available",
  launchDate: "Desired launch date",
  hardDeadline: "Hard deadline",
  budget: "Agreed budget",
  depositPaid: "Deposit paid",
  paymentPlan: "Payment plan",
  decisionMaker: "Final decision maker",
  specialRequests: "Special requests",
  files: "Files to be provided",
  signature: "Client signature",
  signoffDate: "Sign-off date",
  consent: "Consent"
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const normalizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean).join(", ");
  }
  return String(value || "").trim();
};

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const sendEmail = async (payload) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "User-Agent": "ayodev-tech/1.0"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || "Resend rejected the email request.");
  }

  return response.json();
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "Email service is not configured." });
  }

  const body = req.body || {};

  if (body.website) {
    return res.status(200).json({ ok: true });
  }

  const clientName = normalizeValue(body.clientName);
  const brandName = normalizeValue(body.brandName);
  const email = normalizeValue(body.email).toLowerCase();
  const phone = normalizeValue(body.phone);
  const contactMethod = normalizeValue(body.contactMethod);
  const websitePurpose = normalizeValue(body.websitePurpose);
  const primaryGoal = normalizeValue(body.primaryGoal);
  const signature = normalizeValue(body.signature);
  const consent = normalizeValue(body.consent);

  if (
    !clientName ||
    !brandName ||
    !isEmail(email) ||
    !phone ||
    !contactMethod ||
    !websitePurpose ||
    !primaryGoal ||
    !signature ||
    consent !== "Yes"
  ) {
    return res.status(400).json({ error: "Please complete the required fields before submitting." });
  }

  const rows = Object.entries(labels)
    .map(([key, label]) => {
      const value = normalizeValue(body[key]);
      if (!value) return "";
      const safeValue = escapeHtml(value).replace(/\n/g, "<br />");
      return `<tr><th align="left" valign="top" style="padding:8px 12px;border-bottom:1px solid #eceff3;">${escapeHtml(label)}</th><td valign="top" style="padding:8px 12px;border-bottom:1px solid #eceff3;">${safeValue}</td></tr>`;
    })
    .filter(Boolean)
    .join("");

  const textSummary = Object.entries(labels)
    .map(([key, label]) => {
      const value = normalizeValue(body[key]);
      return value ? `${label}: ${value}` : "";
    })
    .filter(Boolean)
    .join("\n");

  const ownerHtml = `
    <h2>New Ayodev.tech client intake</h2>
    <p><strong>${escapeHtml(clientName)}</strong> submitted an intake form for <strong>${escapeHtml(brandName)}</strong>.</p>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px;">
      ${rows}
    </table>
  `;

  const confirmationHtml = `
    <h2>Thanks, ${escapeHtml(clientName)}.</h2>
    <p>Ayodev.tech has received your client intake form for <strong>${escapeHtml(brandName)}</strong>.</p>
    <p>I will review your details and follow up with the next step.</p>
  `;

  try {
    await Promise.all([
      sendEmail({
        from: FROM_EMAIL,
        to: [OWNER_EMAIL],
        reply_to: email,
        subject: `Client intake: ${brandName}`,
        html: ownerHtml,
        text: textSummary
      }),
      sendEmail({
        from: FROM_EMAIL,
        to: [email],
        reply_to: OWNER_EMAIL,
        subject: "Ayodev.tech received your intake form",
        html: confirmationHtml,
        text: `Thanks, ${clientName}.\n\nAyodev.tech has received your client intake form for ${brandName}. I will review your details and follow up with the next step.`
      })
    ]);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(502).json({ error: "Unable to submit the intake form right now. Please try again later." });
  }
};
