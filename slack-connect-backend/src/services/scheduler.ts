import cron from 'node-cron';
import axios from 'axios';
import ScheduledMessage from '../models/ScheduledMessage';
import Token from '../models/tokenModel';

/**
 * Start a cron-based scheduler that periodically sends due scheduled messages to Slack.
 * Runs once per minute, atomically locks jobs to avoid duplicates, and retries on failures.
 */
export const startScheduler = () => {
    console.log('🔄 Scheduler Cron Job Started...');

    // Run every minute. Consider staggering or shard-based scheduling in clustered setups.
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        console.log(`🔍 Checking scheduled messages at: ${now.toISOString()}`);

        // Process messages in a loop to drain all due jobs for this tick
        while (true) {
            // Atomically claim one due message by setting processing=true
            // This prevents multiple workers from handling the same job
            const msg = await ScheduledMessage.findOneAndUpdate(
                { sendAt: { $lte: now }, processing: false }, // Due and not already processing
                { $set: { processing: true } },               // Lock the job
                { new: true }                                 // Return the updated document
            );

            // No more due messages
            if (!msg) {
                console.log('⏳ No messages to send at this time.');
                break;
            }

            try {
                console.log(`🚀 Attempting to send message to Channel: ${msg.channelId}, Workspace: ${msg.workspace}`);

                // Fetch Slack token for the job's workspace
                const tokenDoc = await Token.findOne({ workspace: msg.workspace });

                if (!tokenDoc) {
                    console.error(`❌ No token found for workspace: ${msg.workspace}`);
                    // Unlock for future retry by another run
                    await ScheduledMessage.findByIdAndUpdate(msg._id, { processing: false });
                    continue;
                }

                // Send message via Slack chat.postMessage
                const response = await axios.post(
                    'https://slack.com/api/chat.postMessage',
                    {
                        channel: msg.channelId,
                        text: msg.message,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${tokenDoc.accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.ok) {
                    // Success: remove job to avoid reprocessing
                    console.log(`✅ Message Sent Successfully to ${msg.channelId}: "${msg.message}"`);
                    await ScheduledMessage.findByIdAndDelete(msg._id);
                } else {
                    // Slack API returned an error; unlock for retry on next tick
                    console.error(`❌ Failed to send message to ${msg.channelId}:`, response.data.error);
                    await ScheduledMessage.findByIdAndUpdate(msg._id, { processing: false });
                }
            } catch (error) {
                // Network/axios/other unexpected error; unlock for retry
                console.error('❌ Scheduler Cron Job Error:', error);
                await ScheduledMessage.findByIdAndUpdate(msg._id, { processing: false });
            }
        }
    });
};
