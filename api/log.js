export default async function handler(req, res) {
  try {
    // Get visitor IP from headers
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || "0.0.0.0";

    // Fetch geolocation data (IPinfo)
    const geoRes = await fetch(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`);
    const geo = await geoRes.json();
    const country = geo.country || "XX";

    // Map redirect destination
    const redirectMap = {
      FR: "https://caryse.com/novecs/",
      MA: "https://caryse.com/novecs/",
    };

    const destination = redirectMap[country] || "https://google.fr";

    // Anonymized message
    const message = `🌍 *New Redirect Event*
• Country: _${country}_
• Destination: ${destination}
• Time: ${new Date().toLocaleString()}`;

    // Send Telegram notification (no real IP)
    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    res.status(200).json({ country, destination });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal error" });
  }
}
