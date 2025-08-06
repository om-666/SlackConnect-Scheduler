import cron from 'node-cron';
import axios from 'axios';
import ScheduledMessage from '../models/ScheduledMessage';
import Token from '../models/tokenModel';  // <-- Import Token Model

export const startScheduler = () => {
    console.log('🔄 Scheduler Cron Job Started...');

    // Runs every minute
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        console.log(`🔍 Checking scheduled messages at: ${now.toISOString()}`);

        try {
            // Fetch all messages where sendAt <= now
            const messagesToSend = await ScheduledMessage.find({ sendAt: { $lte: now } });

            for (const msg of messagesToSend) {
                console.log(`🚀 Attempting to send message to Channel: ${msg.channelId}`);

                // Fetch the corresponding token from DB using workspace name
                const tokenDoc = await Token.findOne({ workspace: msg.workspace });

                if (!tokenDoc) {
                    console.error(`❌ No token found for workspace: ${msg.workspace}`);
                    continue;  // Skip this message
                }

                // Send message to Slack API
                const response = await axios.post('https://slack.com/api/chat.postMessage', {
                    channel: msg.channelId,
                    text: msg.message
                }, {
                    headers: {
                        Authorization: `Bearer ${tokenDoc.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.ok) {
                    console.log(`✅ Message Sent Successfully: "${msg.message}"`);
                    // Delete the message after sending
                    await ScheduledMessage.findByIdAndDelete(msg._id);
                } else {
                    console.error(`❌ Failed to send message to ${msg.channelId}:`, response.data.error);
                }
            }
        } catch (error) {
            console.error('❌ Scheduler Cron Job Error:', error);
        }
    });
};
