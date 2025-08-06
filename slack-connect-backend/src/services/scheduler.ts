import cron from 'node-cron';
import axios from 'axios';
import ScheduledMessage from '../models/ScheduledMessage';

export const startScheduler = () => {
    console.log('🔄 Scheduler Cron Job Started...');

    // Runs every minute
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        console.log(`🔍 Checking scheduled messages at: ${now.toISOString()}`);

        try {
            const messagesToSend = await ScheduledMessage.find({ sendAt: { $lte: now } });

            for (const msg of messagesToSend) {
                console.log(`🚀 Sending message to Channel: ${msg.channelId}`);
                
                const response = await axios.post('https://slack.com/api/chat.postMessage', {
                    channel: msg.channelId,
                    text: msg.message
                }, {
                    headers: {
                        Authorization: `Bearer ${msg.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.ok) {
                    console.log(`✅ Message Sent Successfully: ${msg.message}`);
                    await ScheduledMessage.findByIdAndDelete(msg._id);
                } else {
                    console.error(`❌ Failed to send message:`, response.data.error);
                }
            }
        } catch (error) {
            console.error('❌ Scheduler Error:', error);
        }
    });
};
