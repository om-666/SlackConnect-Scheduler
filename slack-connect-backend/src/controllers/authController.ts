import express from 'express';
import type { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import Token from '../models/tokenModel';
import SlackAppCredential from '../models/SlackAppCredential';

dotenv.config();

/**
 * Helper: Fetch Slack App credentials (clientId and clientSecret) from DB.
 * Throws if no credentials are present, since OAuth cannot proceed without them.
 */
async function getSlackAppCredentials() {
  const creds = await SlackAppCredential.findOne({});
  if (!creds) throw new Error('No Slack app credentials found in the database');
  return creds;
}

/**
 * STEP 1: Redirect user to Slack OAuth authorization page.
 * Builds the Slack authorization URL with required scopes and redirect URI.
 * Expects SLACK_REDIRECT_URI in environment variables.
 */
export const slackOAuthRedirect = async (req: Request, res: Response) => {
  try {
    const creds = await getSlackAppCredentials();
    const redirectUri = process.env.SLACK_REDIRECT_URI!; // Must be configured in Slack app and here
    // Note: Add &state=<csrf_token> for CSRF protection; validate it in the callback
    const slackUrl =
      `https://slack.com/oauth/v2/authorize` +
      `?client_id=${encodeURIComponent(creds.clientId)}` +
      `&scope=${encodeURIComponent('chat:write,channels:read')}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}`;

    // Redirect user to Slack's authorization screen
    res.redirect(slackUrl);
  } catch (error: any) {
    // Do not leak sensitive details; log internally
    console.error('Slack OAuth Redirect Error:', error);
    res.status(500).send('Slack app credentials not set in the database.');
  }
};

/**
 * STEP 2: Slack OAuth callback handler.
 * Exchanges the provided authorization code for an access token,
 * then upserts the token in MongoDB keyed by workspace (team name).
 */
export const slackOAuthCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string; // Authorization code from Slack

  try {
    const creds = await getSlackAppCredentials();
    const redirectUri = process.env.SLACK_REDIRECT_URI!;

    // Exchange code for access token via Slack OAuth API
    const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
      params: {
        code,
        client_id: creds.clientId,
        client_secret: creds.clientSecret,
        redirect_uri: redirectUri,
      },
    });

    // Handle Slack API error responses
    if (!response.data.ok) {
      return res.status(400).json({ error: 'Slack OAuth failed', details: response.data });
    }

    const { access_token, team } = response.data;

    // Avoid logging secrets; token printed here only for local debugging
    console.log('Access Token:', access_token);
    console.log('Connected Workspace:', team.name);

    // Upsert workspace token (one token per workspace)
    await Token.findOneAndUpdate(
      { workspace: team.name },                         // Query by workspace identifier
      { accessToken: access_token, workspace: team.name }, // Store/update token
      { upsert: true, new: true }                       // Create if not exists
    );

    // Success response to the client
    res.json({
      message: 'OAuth Success!',
      workspace: team.name,
    });
  } catch (error) {
    // Log for observability; avoid leaking sensitive info in responses
    console.error('OAuth Callback Error:', error);
    res.status(500).send('OAuth Callback Failed');
  }
};
