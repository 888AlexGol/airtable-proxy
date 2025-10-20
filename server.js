require('dotenv').config();
const express = require("express");

const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

app.get("/gifts", async (req, res) => {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/book", async (req, res) => {
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
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
