import express from 'express';
import axios from 'axios';

const router = express.Router();

// Get List of Slack Channels
router.get('/list', async (req, res) => {
    const accessToken = req.query.access_token as string;

    if (!accessToken) {
        return res.status(400).json({ error: 'Access Token is required' });
    }

    try {
        const response = await axios.get('https://slack.com/api/conversations.list', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                types: 'public_channel,private_channel',
                limit: 100
            }
        });

        const data = response.data;

        if (!data.ok) {
            return res.status(400).json({ error: 'Failed to fetch channels', details: data });
        }

        return res.json({ channels: data.channels });

    } catch (error) {
        console.error('Error fetching channels:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
