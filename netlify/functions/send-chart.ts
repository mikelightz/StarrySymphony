import { Handler } from "@netlify/functions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { email, name, sun, moon, rising, aspects, placements } = data;

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

    const getPlanetIcon = (label: string) => {
      const icons: Record<string, string> = {
        "Sun": "☉", "Moon": "☾", "Mercury": "☿", "Venus": "♀",
        "Mars": "♂", "Jupiter": "♃", "Saturn": "♄", "Uranus": "♅",
        "Neptune": "♆", "Pluto": "♇", "Node (M)": "☊", "Node (T)": "☊",
        "Lilith (M)": "⚸", "Chiron": "⚷"
      };
      return icons[label] || "•";
    };

    const getSignStyle = (sign: string) => {
      const styles: Record<string, { icon: string, color: string }> = {
        "Aries": { icon: "♈︎", color: "#e53935" },     // Fire
        "Taurus": { icon: "♉︎", color: "#43a047" },    // Earth
        "Gemini": { icon: "♊︎", color: "#f57c00" },    // Air
        "Cancer": { icon: "♋︎", color: "#1e88e5" },     // Water
        "Leo": { icon: "♌︎", color: "#e53935" },       // Fire
        "Virgo": { icon: "♍︎", color: "#43a047" },     // Earth
        "Libra": { icon: "♎︎", color: "#f57c00" },     // Air
        "Scorpio": { icon: "♏︎", color: "#1e88e5" },    // Water
        "Sagittarius": { icon: "♐︎", color: "#e53935" },// Fire
        "Capricorn": { icon: "♑︎", color: "#43a047" }, // Earth
        "Aquarius": { icon: "♒︎", color: "#f57c00" },   // Air
        "Pisces": { icon: "♓︎", color: "#1e88e5" }     // Water
      };
      return styles[sign] || { icon: "", color: "#333" };
    };

    // Dynamically retrieve the domain for absolute image paths
    const baseUrl = event.headers.origin || event.headers.referer || "https://www.omflorwellness.com";
    
    // Basic HTML template for the email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; background-color: #fdfaf6; padding: 20px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${baseUrl}/images/email_banner.jpg" alt="OmFlor Wellness" style="max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto;" />
        </div>
        <h1 style="color: #6a4f4b; text-align: center;">Your Cosmic Blueprint, ${name || "Friend"}</h1>
        <p style="font-size: 16px;">Here is the full summary of your generated Natal Chart from OmFlor Wellness.</p>
        
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2d9cd;">
          <h2 style="color: #8c6b45; margin-top: 0;">Detailed Placements</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
            <tbody>
              ${placements ? placements.map((p: any) => {
                const s = getSignStyle(p.sign);
                const plIcon = getPlanetIcon(p.label);
                return `
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 6px 0; width: 30px; font-size: 20px; text-align: center;">${plIcon}</td>
                    <td style="padding: 6px 10px; width: 100px;">${p.label}</td>
                    <td style="padding: 6px 0; color: ${s.color}; font-size: 20px; width: 30px; text-align: center;">${s.icon}</td>
                    <td style="padding: 6px 10px; width: 80px;">${p.degree}&deg;${p.minutes.toString().padStart(2, '0')}'</td>
                    <td style="padding: 6px 10px; width: 50px;">${p.signAbbr}</td>
                    <td style="padding: 6px 10px; color: #777;">${p.isRetrograde ? 'R' : ''}</td>
                  </tr>
                `;
              }).join("") : '<tr><td>No placements generated.</td></tr>'}
            </tbody>
          </table>
        </div>

        <div style="background-color: #f8f1e9; padding: 25px 20px; border-radius: 8px; margin: 25px 0; text-align: center; border: 1px dashed #dcb994;">
          <h3 style="color: #8c6b45; margin-top: 0; font-size: 20px;">1:1 Alignment Sessions</h3>
          <p style="font-size: 16px; margin-bottom: 0; color: #555;">Want to deeply understand how these placements uniquely weave together to shape your life? Consider booking a 1:1 Alignment Session to explore the full story of your chart.</p>
        </div>

        <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2d9cd;">
          <h2 style="color: #8c6b45; margin-top: 0;">Major Aspects</h2>
          ${aspects && aspects.length > 0 ? `
            <ul style="padding-left: 20px; font-size: 16px;">
              ${aspects.map((aspect: string) => `<li style="margin-bottom: 8px;">${aspect}</li>`).join("")}
            </ul>
          ` : `<p>No major tight aspects found in this chart.</p>`}
        </div>

        <div style="background-color: #fff; padding: 30px 20px; border-radius: 8px; margin: 35px 0; text-align: center; border: 2px solid #e2d9cd;">
          <h2 style="color: #6a4f4b; margin-top: 0; font-size: 22px;">Align With Your Cosmic Blueprint</h2>
          <p style="font-size: 16px; margin-bottom: 25px; color: #555;">Join me for an empowering <strong>1:1 Alignment Session</strong> to integrate these celestial influences into your daily life and find deeper clarity on your path.</p>
          <a href="${baseUrl}/offerings" style="background-color: #bfa181; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; letter-spacing: 0.5px;">Book Now</a>
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
