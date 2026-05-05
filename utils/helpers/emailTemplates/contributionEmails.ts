const baseStyle = `font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;padding:32px 0;`;
const cardStyle = `background:#fff;max-width:560px;margin:0 auto;border-radius:8px;overflow:hidden;`;
const headerStyle = `background:#1a1a2e;padding:24px 32px;`;
const bodyStyle = `padding:32px;color:#333;font-size:15px;line-height:1.6;`;
const footerStyle = `padding:16px 32px;background:#f5f5f5;color:#888;font-size:12px;text-align:center;`;

const statusMessages: Record<string, { subject: string; heading: string; body: string }> = {
  scheduled: {
    subject: "Your donation collection has been scheduled",
    heading: "Collection Scheduled",
    body: "We've scheduled a time to collect your donation. Our team will be in touch with the details.",
  },
  received: {
    subject: "We've received your donation",
    heading: "Donation Received",
    body: "We've received your donated items — thank you! Our team is now reviewing them.",
  },
  completed: {
    subject: "Your donation has been processed",
    heading: "Donation Complete",
    body: "Your donated items have been added to the Lifescape stock pool and will be distributed to those in need. Thank you so much for your generosity!",
  },
  declined: {
    subject: "Update on your donation",
    heading: "Donation Declined",
    body: "Unfortunately, we're unable to accept your donation at this time. This may be due to current stock levels. Please reach out if you have questions.",
  },
};

export const contributionStatusEmail = (
  name: string,
  code: string,
  status: string
): { subject: string; html: string } => {
  const msg = statusMessages[status] ?? {
    subject: `Update on your donation ${code}`,
    heading: "Donation Update",
    body: `Your donation (${code}) status has been updated to: ${status}.`,
  };

  return {
    subject: msg.subject,
    html: `
      <div style="${baseStyle}">
        <div style="${cardStyle}">
          <div style="${headerStyle}">
            <h1 style="color:#fff;margin:0;font-size:22px;">Lifescape</h1>
          </div>
          <div style="${bodyStyle}">
            <h2 style="margin-top:0;color:#1a1a2e;">${msg.heading}</h2>
            <p>Hi ${name},</p>
            <p>${msg.body}</p>
            <p style="background:#f0f0f0;padding:12px 16px;border-radius:6px;font-family:monospace;font-size:16px;letter-spacing:2px;">
              ${code}
            </p>
          </div>
          <div style="${footerStyle}">
            This is an automated message from Lifescape. Please do not reply.
          </div>
        </div>
      </div>
    `,
  };
};

export const contributionConfirmationEmail = (
  name: string,
  code: string
): { subject: string; html: string } => ({
  subject: "Thank you for your contribution",
  html: `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          <h1 style="color:#fff;margin:0;font-size:22px;">Lifescape</h1>
        </div>
        <div style="${bodyStyle}">
          <h2 style="margin-top:0;color:#1a1a2e;">Contribution Registered</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering your donation with Lifescape! Our team will review your contribution and be in touch to arrange collection or drop-off.</p>
          <p style="background:#f0f0f0;padding:12px 16px;border-radius:6px;font-family:monospace;font-size:16px;letter-spacing:2px;">
            ${code}
          </p>
          <p>Save this code to track your donation.</p>
        </div>
        <div style="${footerStyle}">
          This is an automated message from Lifescape.
        </div>
      </div>
    </div>
  `,
});
