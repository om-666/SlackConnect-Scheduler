import express from 'express';
import axios from 'axios';

const router = express.Router();

// Send Immediate Message to a Slack Channel
router.post('/send', async (req, res) => {
    const { accessToken, channelId, message } = req.body;

    if (!accessToken || !channelId || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const response = await axios.post('https://slack.com/api/chat.postMessage', {
            channel: channelId,
            text: message
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = response.data;

        if (!data.ok) {
            return res.status(400).json({ error: 'Failed to send message', details: data });
        }

        return res.json({ message: 'Message sent successfully!', ts: data.ts });

    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
