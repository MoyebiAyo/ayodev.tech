const LOGO_URL = "https://ayodev.tech/assets/ayodele-personal-logo.png";

const renderEmail = ({ eyebrow, title, lead, children, footer = "Ayodev.tech - Clean code, thoughtful product delivery." }) => `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f2;color:#272523;font-family:Inter,Segoe UI,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f4f4f2;padding:32px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;background:#fff;border:1px solid #e7e4df;border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(32,30,27,0.07);">
            <tr>
              <td style="padding:28px 28px 18px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${LOGO_URL}" width="42" height="42" alt="ayodev.tech logo" style="display:block;width:42px;height:42px;object-fit:contain;border:0;" />
                    </td>
                    <td align="right" style="vertical-align:middle;color:#475468;font-size:14px;font-weight:700;">
                      ayodev.tech
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:4px 28px 28px;">
                <p style="display:inline-block;margin:0 0 16px;padding:7px 11px;border:1px solid #e2e5ea;border-radius:999px;background:#f8f8f6;color:#566173;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">${eyebrow}</p>
                <h1 style="margin:0;color:#272523;font-family:Georgia,'Times New Roman',serif;font-size:38px;line-height:.98;font-weight:500;letter-spacing:0;">${title}</h1>
                <p style="margin:18px 0 0;color:#596273;font-size:16px;line-height:1.6;">${lead}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 30px;">
                ${children}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#171512;color:#fff;">
                <p style="margin:0;font-size:13px;line-height:1.5;color:#f4f4f2;">${footer}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const detailTable = (rows) => `
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate;border-spacing:0;border:1px solid #e7e4df;border-radius:14px;overflow:hidden;background:#fbfbfa;">
    ${rows}
  </table>
`;

const detailRow = (label, value) => `
  <tr>
    <th align="left" valign="top" style="width:34%;padding:13px 14px;border-bottom:1px solid #eceff3;color:#475468;font-size:13px;line-height:1.45;font-weight:800;">${label}</th>
    <td valign="top" style="padding:13px 14px;border-bottom:1px solid #eceff3;color:#07122c;font-size:14px;line-height:1.55;">${value}</td>
  </tr>
`;

const messageBlock = (html) => `
  <div style="margin-top:18px;padding:18px;border:1px solid #e7e4df;border-radius:14px;background:#fbfbfa;color:#07122c;font-size:15px;line-height:1.65;">
    ${html}
  </div>
`;

module.exports = {
  detailRow,
  detailTable,
  messageBlock,
  renderEmail
};
