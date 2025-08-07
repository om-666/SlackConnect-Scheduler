import express from 'express';
import axios from 'axios';
import ScheduledMessage from '../models/ScheduledMessage';
import Token from '../models/tokenModel';  // <-- Import Token Model

const router = express.Router();

// Send Immediate Message to a Slack Channel (Fetch Token from DB)
router.post('/send', async (req, res) => {
    const { workspace, channelId, message } = req.body;

    if (!workspace || !channelId || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const tokenDoc = await Token.findOne({ workspace });

        if (!tokenDoc) {
            return res.status(404).json({ error: 'Workspace token not found' });
        }

        const response = await axios.post('https://slack.com/api/chat.postMessage', {
            channel: channelId,
            text: message
        }, {
            headers: {
                Authorization: `Bearer ${tokenDoc.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.ok) {
            return res.json({ message: 'Message sent successfully!', ts: response.data.ts });
        } else {
            return res.status(400).json({ error: 'Failed to send message', details: response.data });
        }

    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Schedule Message (Store workspace only, fetch token later in cron)
router.post('/schedule', async (req, res) => {
    const { workspace, channelId, message, sendAt } = req.body;

    if (!workspace || !channelId || !message || !sendAt) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const scheduledMessage = new ScheduledMessage({
            workspace,   // <-- Ensure this is saved
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


// List All Scheduled Messages (Upcoming)
// router.get('/scheduled', async (req, res) => {
//     try {
//         const now = new Date();

//         const scheduledMessages = await ScheduledMessage.find({
//             sendAt: { $gte: now }
//         }).sort({ sendAt: 1 });  // Sort by time (earliest first)

//         return res.json({ messages: scheduledMessages });

//     } catch (error) {
//         console.error('Failed to fetch scheduled messages:', error);
//         return res.status(500).json({ error: 'Failed to fetch scheduled messages' });
//     }
// });

router.post('/scheduled', async (req, res) => {
    try {
        const { workspace } = req.body;

        if (!workspace) {
            return res.status(400).json({ error: 'Workspace is required' });
        }

        const now = new Date();

        const scheduledMessages = await ScheduledMessage.find({
            workspace: workspace,
            sendAt: { $gte: now }
        }).sort({ sendAt: 1 });

        return res.json({ messages: scheduledMessages });

    } catch (error) {
        console.error('Failed to fetch scheduled messages:', error);
        return res.status(500).json({ error: 'Failed to fetch scheduled messages' });
    }
});


// Cancel Scheduled Message
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMessage = await ScheduledMessage.findByIdAndDelete(id);

        if (!deletedMessage) {
            return res.status(404).json({ error: 'Scheduled message not found' });
        }

        return res.json({ message: 'Scheduled message cancelled successfully!' });

    } catch (error) {
        console.error('Failed to cancel scheduled message:', error);
        return res.status(500).json({ error: 'Failed to cancel scheduled message' });
    }
});

export default router;
