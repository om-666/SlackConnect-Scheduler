import express from 'express';
import { slackOAuthRedirect, slackOAuthCallback } from '../controllers/authController';

const router = express.Router();

router.get('/slack', slackOAuthRedirect);
router.get('/slack/callback', slackOAuthCallback);

export default router;
