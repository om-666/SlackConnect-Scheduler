// import cron from 'node-cron';
// import axios from 'axios';
// import ScheduledMessage from '../models/ScheduledMessage';
// import Token from '../models/tokenModel';

// export const startScheduler = () => {
//     console.log('🔄 Scheduler Cron Job Started...');

//     cron.schedule('* * * * *', async () => {
//         const now = new Date();
//         console.log(`🔍 Checking scheduled messages at: ${now.toISOString()}`);

//         try {
//             const messagesToSend = await ScheduledMessage.find({ sendAt: { $lte: now } });

//             if (messagesToSend.length === 0) {
//                 console.log('⏳ No messages to send at this time.');
//                 return;
//             }

//             for (const msg of messagesToSend) {
//                 console.log(`🚀 Attempting to send message to Channel: ${msg.channelId}, Workspace: ${msg.workspace}`);

//                 const tokenDoc = await Token.findOne({ workspace: msg.workspace });

//                 if (!tokenDoc) {
//                     console.error(`❌ No token found for workspace: ${msg.workspace}`);
//                     continue;
//                 }

//                 const response = await axios.post('https://slack.com/api/chat.postMessage', {
//                     channel: msg.channelId,
//                     text: msg.message
//                 }, {
//                     headers: {
//                         Authorization: `Bearer ${tokenDoc.accessToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 if (response.data.ok) {
//                     console.log(`✅ Message Sent Successfully to ${msg.channelId}: "${msg.message}"`);
//                     await ScheduledMessage.findByIdAndDelete(msg._id);
//                 } else {
//                     console.error(`❌ Failed to send message to ${msg.channelId}:`, response.data.error);
//                 }
//             }
//         } catch (error) {
//             console.error('❌ Scheduler Cron Job Error:', error);
//         }
//     });
// };

import cron from 'node-cron';
import axios from 'axios';
import ScheduledMessage from '../models/ScheduledMessage';
import Token from '../models/tokenModel';

export const startScheduler = () => {
    console.log('🔄 Scheduler Cron Job Started...');

    cron.schedule('* * * * *', async () => {
        const now = new Date();
        console.log(`🔍 Checking scheduled messages at: ${now.toISOString()}`);

        while (true) {
            // Atomically find and lock one scheduled message for processing
            const msg = await ScheduledMessage.findOneAndUpdate(
                { sendAt: { $lte: now }, processing: false },
                { $set: { processing: true } },
                { new: true }
            );

            if (!msg) {
                console.log('⏳ No messages to send at this time.');
                break; // Nothing left to process
            }

            try {
                console.log(`🚀 Attempting to send message to Channel: ${msg.channelId}, Workspace: ${msg.workspace}`);

                const tokenDoc = await Token.findOne({ workspace: msg.workspace });

                if (!tokenDoc) {
                    console.error(`❌ No token found for workspace: ${msg.workspace}`);
                    // Reset processing so future crons can retry
                    await ScheduledMessage.findByIdAndUpdate(msg._id, { processing: false });
                    continue;
                }

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
                    console.log(`✅ Message Sent Successfully to ${msg.channelId}: "${msg.message}"`);
                    await ScheduledMessage.findByIdAndDelete(msg._id);
                } else {
                    console.error(`❌ Failed to send message to ${msg.channelId}:`, response.data.error);
                    // Reset processing for retry
                    await ScheduledMessage.findByIdAndUpdate(msg._id, { processing: false });
                }
            } catch (error) {
                console.error('❌ Scheduler Cron Job Error:', error);
                // Reset processing for retry
                await ScheduledMessage.findByIdAndUpdate(msg._id, { processing: false });
            }
        }
    });
};
