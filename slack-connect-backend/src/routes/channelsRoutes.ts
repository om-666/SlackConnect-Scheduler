import express from 'express';
import axios from 'axios';

const router = express.Router();

 
// Get list of Slack channels for a workspace using a provided access token
router.get('/list', async (req, res) => {
    // Access token expected as a query parameter (e.g., ?access_token=xoxb-...)
    const accessToken = req.query.access_token as string;

    // Validate required input
    if (!accessToken) {
        // Bad Request: missing token
        return res.status(400).json({ error: 'Access Token is required' });
    }

    try {
        // Call Slack API to fetch channels (public and private) with a limit
        const response = await axios.get('https://slack.com/api/conversations.list', {
            headers: {
                Authorization: `Bearer ${accessToken}` // Bearer auth with Slack token
            },
            params: {
                types: 'public_channel,private_channel', // Include both public and private channels
                limit: 100                                // Page size; use cursor for pagination if needed
            }
        });

        const data = response.data;

        // Handle Slack API error responses
        if (!data.ok) {
            return res.status(400).json({ error: 'Failed to fetch channels', details: data });
        }

        // Success: return the channels array
        return res.json({ channels: data.channels });

    } catch (error) {
        // Log for diagnostics/observability
        console.error('Error fetching channels:', error);
        // Generic server error response
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;
