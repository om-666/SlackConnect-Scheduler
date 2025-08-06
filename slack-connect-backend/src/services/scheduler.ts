import cron from 'node-cron';
import axios from 'axios';
import ScheduledMessage from '../models/ScheduledMessage';

export const startScheduler = () => {
    cron.schedule('* * * * *', async () => {
        const now = new Date();

        const messagesToSend = await ScheduledMessage.find({ sendAt: { $lte: now } });

        for (const msg of messagesToSend) {
            try {
                await axios.post('https://slack.com/api/chat.postMessage', {
                    channel: msg.channelId,
                    text: msg.message
                }, {
                    headers: {
                        Authorization: `Bearer ${msg.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log(`Message sent to channel ${msg.channelId} at ${msg.sendAt}`);

                // Delete after sending
                await ScheduledMessage.findByIdAndDelete(msg._id);

            } catch (error) {
                console.error('Failed to send scheduled message:', error);
            }
        }
    });
};
