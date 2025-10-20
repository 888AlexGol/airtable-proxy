import fetch from "node-fetch";

export default async function handler(req, res) {
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

  if (req.method === "POST") {
    const { recordId, name } = req.body;
    if (!recordId || !name) return res.status(400).json({ error: "recordId и name обязательны" });

    try {
      const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${recordId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: { Status: "Забронирован", BookedBy: name }
        })
      });

      if (!response.ok) throw new Error("Ошибка при бронировании");
      const data = await response.json();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
