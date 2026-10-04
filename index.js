const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Advanced User Lookup Route
app.get('/api/lookup', async (req, res) => {
  const sid = req.query.sid;

  if (!sid || !/^\d+$/.test(sid)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Valid numeric StarMaker ID required (e.g., ?sid=100124507028)' 
    });
  }

  try {
    // Primary API request
    const response = await fetch(`https://starmaker.id.vn/wp-json/sm-user/v1/lookup?sid=${sid}`);
    const result = await response.json();

    const userData = result?.data?.user || {};
    const familyData = result?.data?.family || {};

    // Response formatting
    res.status(response.status).json({
      success: true,
      query_id: sid,
      profile: {
        name: userData.name || "N/A",
        stage_name: userData.stage_name || "N/A",
        gender: userData.gender || "N/A",
        user_level: userData.user_level || "N/A",
        created_on: userData.created_on || "N/A",
        // Fields jo abhi public API mein limited hain
        country: userData.country || familyData.country || "Restricted / Not Provided by API",
        last_updated: userData.updated_date || "Not Provided by API",
        registration_method: userData.register_type || "Not Provided by API",
        last_device: userData.device || "Not Provided by API"
      },
      family_info: {
        family_id: familyData.id || "N/A",
        family_name: familyData.name || "N/A",
        family_country: familyData.country || "N/A"
      },
      raw_source_data: result
    });

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch profile data from server', 
      details: err.message 
    });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('StarMaker Advanced API is running successfully!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
