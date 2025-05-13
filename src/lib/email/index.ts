import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string; // Optional: defaults to a value from .env or a standard address
}

export const sendEmail = async ({ to, subject, html, from }: EmailOptions) => {
  const fromAddress = from || process.env.EMAIL_FROM || "onboarding@resend.dev";

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set. Email not sent.");
    // In a real app, you might want to throw an error or handle this more gracefully
    // For now, we'll log and prevent sending if the key is missing.
    // During development, you might still want the app to function without sending actual emails.
    if (process.env.NODE_ENV === "development") {
      console.log(`Email to: ${to}\nSubject: ${subject}\nHTML: ${html}`);
      return {
        success: true,
        message: "Email logged to console in development mode.",
      };
    }
    return { success: false, error: "RESEND_API_KEY is not configured." };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (exception) {
    console.error("Exception sending email:", exception);
    return { success: false, error: exception };
  }
};
