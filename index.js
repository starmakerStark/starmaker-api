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
    const data = await response.json();

    // Yahan aap JSON response ki keys ke hisab se data customize kar sakte hain
    res.status(response.status).json({
      success: true,
      user_id: sid,
      country: data.country || data.region || data.location || "Not found in API",
      last_update: data.updated_at || data.last_update || data.time || "Not found in API",
      family_info: data.family || data.family_info || "Not found",
      raw_data: data // Sara raw data dekhne ke liye
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
