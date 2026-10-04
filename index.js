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

    const userData = result?.data?.user || {};

    res.status(response.status).json({
      success: true,
      user_id: sid,
      name: userData.name || "N/A",
      // Device aur registration details agar API me hongi toh yahan catch ho jayengi
      registration_method: userData.register_type || userData.reg_method || userData.source || "N/A",
      last_device: userData.device || userData.last_device || userData.phone_model || "N/A",
      created_on: userData.created_on || "N/A",
      updated_date: userData.updated_date || "N/A",
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
