exports.handler = async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const ref = event.queryStringParameters.ref;
  if (!ref) {
    return { statusCode: 400, body: "Missing ref parameter" };
  }

  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Missing Telegram Environment Variables");
    return { statusCode: 500, body: "Server Configuration Error" };
  }

  // Extract Geo Data from Netlify Headers
  const country = event.headers["x-country"] || "Unknown Country";
  const city = event.headers["x-city"] || "Unknown City";
  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["client-ip"] ||
    "Unknown IP";

  // Sanitize inputs for HTML to prevent breakage
  const safeRef = ref.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeCity = city.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeCountry = country.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Format time beautifully (e.g., 17.03.2026, 15:54:27)
  const formattedTime =
    new Date().toLocaleString("ru-RU", {
      timeZone: "Europe/Moscow", // Установил московское/минское время (UTC+3)
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " (MSK)";

  const message = `
<b>🚀 New Portfolio Visit!</b>

<b>Source:</b> <code>${safeRef}</code>
<b>Location:</b> ${safeCity}, ${safeCountry}
<b>IP:</b> <code>${ip}</code>
<b>Time:</b> ${formattedTime}
  `;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Telegram API Error:", errorText);
      return { statusCode: 500, body: "Failed to send notification" };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notification sent" }),
    };
  } catch (error) {
    console.error("Error sending telegram message:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
