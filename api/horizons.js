
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const incomingUrl = new URL(
      req.url,
      `https://${req.headers.host || "localhost"}`
    );

    const jplUrl = new URL(
      "https://ssd-api.jpl.nasa.gov/api/horizons.api"
    );

    incomingUrl.searchParams.forEach((value, key) => {
      jplUrl.searchParams.append(key, value);
    });

    const response = await fetch(jplUrl.toString());
    const data = await response.text();

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/json"
    );

    res.setHeader("Cache-Control", "no-store");

    return res.status(response.status).send(data);

  } catch (error) {
    return res.status(502).json({
      error: "Unable to reach NASA JPL Horizons API",
      details: error.message
    });
  }
}
