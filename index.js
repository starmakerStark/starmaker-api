const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/lookup', async (req, res) => {
  const sid = req.query.sid;

  if (!sid || !/^\d+$/.test(sid)) {
    return res.status(400).json({ error: 'Valid numeric StarMaker ID required' });
  }

  try {
    const response = await fetch(`https://starmaker.id.vn/wp-json/sm-user/v1/lookup?sid=${sid}`);
    const result = await response.json();

    // Screenshot ke mutabiq exact keys extract kar rahe hain
    const userData = result?.data?.user || {};
    const familyData = result?.data?.family || {};

    res.status(response.status).json({
      success: true,
      user_id: sid,
      name: userData.name || "N/A",
      stage_name: userData.stage_name || "N/A",
      country: familyData.country || userData.country || "Not Available",
      last_update: userData.updated_date || userData.created_on || "N/A",
      family_info: {
        family_id: familyData.id || "N/A",
        family_name: familyData.name || "N/A",
        family_country: familyData.country || "N/A",
        family_created_date: familyData.created_date || "N/A"
      },
      raw_data: result
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('StarMaker API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
