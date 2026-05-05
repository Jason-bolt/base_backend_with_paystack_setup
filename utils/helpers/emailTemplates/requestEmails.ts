const baseStyle = `font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;padding:32px 0;`;
const cardStyle = `background:#fff;max-width:560px;margin:0 auto;border-radius:8px;overflow:hidden;`;
const headerStyle = `background:#1a1a2e;padding:24px 32px;`;
const bodyStyle = `padding:32px;color:#333;font-size:15px;line-height:1.6;`;
const footerStyle = `padding:16px 32px;background:#f5f5f5;color:#888;font-size:12px;text-align:center;`;

const statusMessages: Record<string, { subject: string; heading: string; body: string }> = {
  processing: {
    subject: "Your request is being reviewed",
    heading: "Request Under Review",
    body: "Great news — your request is now being reviewed by our team. We'll reach out to you shortly via your preferred contact method.",
  },
  "ready-to-schedule": {
    subject: "Your request has been approved",
    heading: "Request Approved!",
    body: "Your request has been approved. Please log on to select a convenient pickup or delivery time slot.",
  },
  scheduled: {
    subject: "Your handover has been scheduled",
    heading: "Handover Scheduled",
    body: "Your request has been scheduled. Keep an eye out for final confirmation details.",
  },
  fulfilled: {
    subject: "Your request has been fulfilled",
    heading: "Request Fulfilled",
    body: "Your request has been successfully fulfilled. Thank you for being part of the Lifescape community!",
  },
  waitlisted: {
    subject: "Your request has been waitlisted",
    heading: "Added to Waitlist",
    body: "We currently don't have enough stock to fulfil your request, but we've added you to our waitlist. We'll notify you as soon as items become available.",
  },
  declined: {
    subject: "Update on your request",
    heading: "Request Declined",
    body: "Unfortunately, we're unable to fulfil your request at this time. If you have questions, please don't hesitate to reach out.",
  },
};

export const requestStatusEmail = (
  name: string,
  code: string,
  status: string
): { subject: string; html: string } => {
  const msg = statusMessages[status] ?? {
    subject: `Update on your request ${code}`,
    heading: "Request Update",
    body: `Your request (${code}) status has been updated to: ${status}.`,
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
            <p>Use the code above to track your request at any time.</p>
          </div>
          <div style="${footerStyle}">
            This is an automated message from Lifescape. Please do not reply to this email.
          </div>
        </div>
      </div>
    `,
  };
};

export const requestConfirmationEmail = (
  name: string,
  code: string
): { subject: string; html: string } => ({
  subject: "We've received your request",
  html: `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          <h1 style="color:#fff;margin:0;font-size:22px;">Lifescape</h1>
        </div>
        <div style="${bodyStyle}">
          <h2 style="margin-top:0;color:#1a1a2e;">Request Received</h2>
          <p>Hi ${name},</p>
          <p>Thank you for submitting your request. Our team will review it and be in touch with you shortly.</p>
          <p style="background:#f0f0f0;padding:12px 16px;border-radius:6px;font-family:monospace;font-size:16px;letter-spacing:2px;">
            ${code}
          </p>
          <p>Save this code to track your request status.</p>
        </div>
        <div style="${footerStyle}">
          This is an automated message from Lifescape.
        </div>
      </div>
    </div>
  `,
});
