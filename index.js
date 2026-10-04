const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/user', async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    const ts = Math.floor(Date.now() / 1000);
    const url = `https://pay.starmakerstudios.com/rapid/user?category=&id=${id}&rts=${ts}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; U; Android 14; en-in; SM-E546B Build/UP1A.231005.007) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'origin': 'https://m.starmakerstudios.com',
                'sec-fetch-site': 'same-site',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': 'https://m.starmakerstudios.com/',
                'accept-language': 'en-US,en;q=0.9'
            }
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data', details: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('StarMaker API is live 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
