const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Main user detail route
app.get('/api/user', async (req, res) => {
    const id = req.query.id;
    
    if (!id) {
        return res.status(400).json({ 
            status: false, 
            message: "Please provide a valid user id using ?id=YOUR_ID" 
        });
    }

    try {
        const timestamp = Date.now();
        // Updated secure endpoint structure
        const targetUrl = `https://www.starmakerstudios.com/api/common/profile/basic_info?user_id=${id}&_=${timestamp}`;

        const apiResponse = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Referer': 'https://www.starmakerstudios.com/'
            }
        });

        const resultData = await apiResponse.json();

        // Returning the clean parsed data
        res.status(200).json({
            success: true,
            query_id: id,
            data: resultData
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch profile details", 
            details: error.message 
        });
    }
});

// Root check route
app.get('/', (req, res) => {
    res.json({ message: "StarMaker Fresh API is running successfully!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
