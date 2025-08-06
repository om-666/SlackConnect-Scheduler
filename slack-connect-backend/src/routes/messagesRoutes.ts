import express from 'express';
import axios from 'axios';
import ScheduledMessage from '../models/ScheduledMessage';
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
router.post('/schedule', async (req, res) => {
    const { accessToken, channelId, message, sendAt } = req.body;

    if (!accessToken || !channelId || !message || !sendAt) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const scheduledMessage = new ScheduledMessage({
            accessToken,
            channelId,
            message,
            sendAt: new Date(sendAt)
        });

        await scheduledMessage.save();

        return res.json({ message: 'Message scheduled successfully!', id: scheduledMessage._id });

    } catch (error) {
        console.error('Error scheduling message:', error);
        return res.status(500).json({ error: 'Failed to schedule message' });
    }
});
router.get('/scheduled', async (req, res) => {
    try {
        const now = new Date();

        const scheduledMessages = await ScheduledMessage.find({
            sendAt: { $gte: now }
        }).sort({ sendAt: 1 });  // Sort by time (earliest first)

        return res.json({ messages: scheduledMessages });

    } catch (error) {
        console.error('Failed to fetch scheduled messages:', error);
        return res.status(500).json({ error: 'Failed to fetch scheduled messages' });
    }
});


export default router;
