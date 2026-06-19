const OWNER_EMAIL = "me@ayodev.tech";
const FROM_EMAIL = "Ayodele <amin@ayodev.tech>";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

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

  const { name, email, package: selectedPackage, message, website } = req.body || {};

  if (website) {
    return res.status(200).json({ ok: true });
  }

  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanPackage = String(selectedPackage || "").trim();
  const cleanMessage = String(message || "").trim();

  if (!cleanName || !isEmail(cleanEmail) || !cleanPackage || !cleanMessage) {
    return res.status(400).json({ error: "Please fill in every field with a valid email address." });
  }

  const safeName = escapeHtml(cleanName);
  const safeEmail = escapeHtml(cleanEmail);
  const safePackage = escapeHtml(cleanPackage);
  const safeMessage = escapeHtml(cleanMessage).replace(/\n/g, "<br />");

  const ownerHtml = `
    <h2>New hire request from ayodev.tech</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Email:</strong> ${safeEmail}</p>
    <p><strong>Package:</strong> ${safePackage}</p>
    <p><strong>Project details:</strong></p>
    <p>${safeMessage}</p>
  `;

  const confirmationHtml = `
    <h2>Thanks for reaching out, ${safeName}.</h2>
    <p>I received your project brief for the <strong>${safePackage}</strong> package.</p>
    <p>I will review the details and reply with the next best step.</p>
    <p><strong>Your message:</strong></p>
    <p>${safeMessage}</p>
  `;

  try {
    await Promise.all([
      sendEmail({
        from: FROM_EMAIL,
        to: [OWNER_EMAIL],
        reply_to: cleanEmail,
        subject: `New hire request: ${cleanPackage}`,
        html: ownerHtml,
        text: `Name: ${cleanName}\nEmail: ${cleanEmail}\nPackage: ${cleanPackage}\n\n${cleanMessage}`
      }),
      sendEmail({
        from: FROM_EMAIL,
        to: [cleanEmail],
        reply_to: OWNER_EMAIL,
        subject: "Your ayodev.tech project brief was received",
        html: confirmationHtml,
        text: `Thanks for reaching out, ${cleanName}.\n\nI received your project brief for the ${cleanPackage} package and will reply with the next best step.\n\nYour message:\n${cleanMessage}`
      })
    ]);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(502).json({ error: "Unable to send email right now. Please try WhatsApp instead." });
  }
};
