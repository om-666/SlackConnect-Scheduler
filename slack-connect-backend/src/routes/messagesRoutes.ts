import express from 'express';
import axios from 'axios';
import ScheduledMessage from '../models/ScheduledMessage';
import Token from '../models/tokenModel'; 
import SlackAppCredential from '../models/SlackAppCredential.js';

const router = express.Router();

// Send Immediate Message to a Slack Channel (Fetch Token from DB)
router.post('/send', async (req, res) => {
    // Destructure required fields from request body
    const { workspace, channelId, message } = req.body;

    // Input Validation: Ensure all required fields are present
    if (!workspace || !channelId || !message) {
        // Respond with HTTP 400 if any field is missing
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Fetch Slack access token for the provided workspace from the database
        const tokenDoc = await Token.findOne({ workspace });

        // If token not found, respond with HTTP 404
        if (!tokenDoc) {
            return res.status(404).json({ error: 'Workspace token not found' });
        }

        // Send message to Slack channel using chat.postMessage API
        const response = await axios.post(
            'https://slack.com/api/chat.postMessage',
            {
                channel: channelId,    // Target Slack channel ID
                text: message          // Message to send
            },
            {
                headers: {
                    // Use Bearer token for authentication
                    Authorization: `Bearer ${tokenDoc.accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // If Slack API returns success
        if (response.data.ok) {
            // Respond with message and Slack timestamp
            return res.json({ message: 'Message sent successfully!', ts: response.data.ts });
        } else {
            // Respond with Slack API error details
            return res.status(400).json({ error: 'Failed to send message', details: response.data });
        }

    } catch (error) {
        // Log error for diagnostics
        console.error('Error sending message:', error);
        // Respond with internal server error
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});




// Schedule a message to be sent later
router.post('/schedule', async (req, res) => {
    // Extract required fields from the request body
    const { workspace, channelId, message, sendAt } = req.body;

    // Validate inputs: all fields must be provided
    if (!workspace || !channelId || !message || !sendAt) {
        // Bad Request: client did not supply all required fields
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Construct a new scheduled message document
        // Note: sendAt is converted to Date to ensure proper type in DB and later processing
        const scheduledMessage = new ScheduledMessage({
            workspace,          // Workspace identifier used to resolve token later
            channelId,          // Target Slack channel ID
            message,            // Message content to be sent
            sendAt: new Date(sendAt), // Scheduled send time (must be a valid date)
            processing: false   // Initialize processing state; used by worker/cron to avoid double-sends
        });

        // Persist the scheduled message to the database
        await scheduledMessage.save();

        // Success: return a confirmation and the new record ID for tracking/cancellation
        return res.json({
            message: 'Message scheduled successfully!',
            id: scheduledMessage._id
        });

    } catch (error) {
        // Log internal error details for observability and debugging
        console.error('Error scheduling message:', error);
        // Generic server error response (avoid leaking internals to clients)
        return res.status(500).json({ error: 'Failed to schedule message' });
    }
});


 

// Retrieve upcoming scheduled messages for a workspace
router.post('/scheduled', async (req, res) => {
    try {
        const { workspace } = req.body;

        // Validate inputs: workspace must be provided
        if (!workspace) {
            // Bad Request: missing required field
            return res.status(400).json({ error: 'Workspace is required' });
        }

        const now = new Date(); // Current timestamp used to filter future messages

        // Query DB for all scheduled messages for this workspace that are in the future
        // Sorted by sendAt ascending so the next message appears first
        const scheduledMessages = await ScheduledMessage.find({
            workspace,           // Filter by workspace
            sendAt: { $gte: now } // Only messages scheduled for now or later
        }).sort({ sendAt: 1 });

        // Success: return the list of upcoming messages
        return res.json({ messages: scheduledMessages });

    } catch (error) {
        // Log internal error details for diagnostics/observability
        console.error('Failed to fetch scheduled messages:', error);
        // Generic server error (avoid exposing internals)
        return res.status(500).json({ error: 'Failed to fetch scheduled messages' });
    }
});


// Cancel a scheduled message by its ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params; // ScheduledMessage document identifier

    try {
        // Attempt to delete the scheduled message from the database
        const deletedMessage = await ScheduledMessage.findByIdAndDelete(id);

        // If no document was found for the provided ID, respond with 404
        if (!deletedMessage) {
            return res.status(404).json({ error: 'Scheduled message not found' });
        }

        // Success: confirm cancellation
        return res.json({ message: 'Scheduled message cancelled successfully!' });

    } catch (error) {
        // Log error for diagnostics/observability
        console.error('Failed to cancel scheduled message:', error);
        // Generic server error response to avoid leaking internals
        return res.status(500).json({ error: 'Failed to cancel scheduled message' });
    }
});


// Save or update Slack App credentials (Client ID and Client Secret)
// Uses upsert to maintain a single global credentials record
router.post('/slack/credentials', async (req, res) => {
    // Extract credentials from request body (typed for clarity)
    const { clientId, clientSecret } = req.body as { clientId?: string; clientSecret?: string };

    // Validate required inputs
    if (!clientId || !clientSecret) {
        // Bad Request: both clientId and clientSecret are mandatory
        return res.status(400).json({ error: 'Client ID and Client Secret are required' });
    }

    try {
        // Upsert a single document to store Slack app credentials.
        // Empty filter `{}` implies a singleton config record.
        await SlackAppCredential.findOneAndUpdate(
            {},                   // Match the singleton credentials document
            { clientId, clientSecret }, // Replace with provided values
            { upsert: true, new: true } // Create if missing; return the updated doc
        );

        // Success: acknowledge that credentials are stored
        return res.json({ message: 'Slack App credentials saved successfully!' });
    } catch (error) {
        // Log internal error details for diagnostics
        console.error('Error saving Slack App credentials:', error);
        // Generic server error response (avoid exposing details)
        return res.status(500).json({ error: 'Failed to save credentials' });
    }
});


export default router;
