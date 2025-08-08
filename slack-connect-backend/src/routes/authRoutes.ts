import express from 'express';
import { slackOAuthRedirect, slackOAuthCallback } from '../controllers/authController';

const router = express.Router();

// Initiate Slack OAuth flow
// Redirects the user to Slack's authorization page with required scopes/state
router.get('/slack', slackOAuthRedirect);

// Slack OAuth callback endpoint
// Handles the redirect from Slack, exchanges code for tokens, and finalizes auth
router.get('/slack/callback', slackOAuthCallback);

export default router;
