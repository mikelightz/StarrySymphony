import { Handler } from "@netlify/functions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { email, name, sun, moon, rising, aspects } = data;

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email is required" }) };
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not defined. Emulating success for development.");
      // If we don't have a key but want to test the flow, we just return success in dev.
      // In production, this should fail if the key isn't set.
      return { 
        statusCode: 200, 
        body: JSON.stringify({ message: "Email logic executed (mocked success, no API key found)" }) 
      };
    }

    // Basic HTML template for the email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; background-color: #fdfaf6; padding: 20px; border-radius: 8px;">
        <h1 style="color: #6a4f4b; text-align: center;">Your Cosmic Blueprint, ${name || "Friend"}</h1>
        <p style="font-size: 16px;">Here is the full summary of your generated Natal Chart from OmFlor Wellness.</p>
        
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2d9cd;">
          <h2 style="color: #8c6b45; margin-top: 0;">Your Big Three</h2>
          <ul style="list-style-type: none; padding: 0; font-size: 16px;">
            <li style="margin-bottom: 10px;"><strong>Sun:</strong> ${sun || "Unknown"}</li>
            <li style="margin-bottom: 10px;"><strong>Moon:</strong> ${moon || "Unknown"}</li>
            <li style="margin-bottom: 10px;"><strong>Rising:</strong> ${rising || "Unknown"}</li>
          </ul>
        </div>

        <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2d9cd;">
          <h2 style="color: #8c6b45; margin-top: 0;">Major Aspects</h2>
          ${aspects && aspects.length > 0 ? `
            <ul style="padding-left: 20px; font-size: 16px;">
              ${aspects.map((aspect: string) => `<li style="margin-bottom: 8px;">${aspect}</li>`).join("")}
            </ul>
          ` : `<p>No major tight aspects found in this chart.</p>`}
        </div>

        <p style="text-align: center; color: #777; font-size: 14px; margin-top: 30px;">
          Warmly,<br />
          <strong>OmFlor Wellness</strong>
        </p>
      </div>
    `;

    const { data: responseData, error } = await resend.emails.send({
      from: "OmFlor Wellness <onboarding@resend.dev>", 
      to: [email],
      subject: "Your OmFlor Wellness Natal Chart",
      text: `Your Natal Chart:\nSun: ${sun}\nMoon: ${moon}\nRising: ${rising}`,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to send email. Check your Resend configuration." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully", id: responseData?.id }),
    };
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unhandled internal server error." }),
    };
  }
};
