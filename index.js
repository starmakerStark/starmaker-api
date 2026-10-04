const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Main route jo ID fetch karega
app.get('/api/user', async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: "Please provide an ID like ?id=100124507028" });
    }

    try {
        const ts = Math.floor(Date.now() / 1000);
        const url = `https://pay.starmakerstudios.com/rapid/user?category=&id=${id}&rts=${ts}`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10)'
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch", details: err.message });
    }
});

// Root route taaki base URL kholne par error na aaye
app.get('/', (req, res) => {
    res.json({ status: "API is working! Use /api/user?id=YOUR_ID" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
