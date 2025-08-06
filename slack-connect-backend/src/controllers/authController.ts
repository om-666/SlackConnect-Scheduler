import express from 'express';
import type { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import Token from '../models/tokenModel';  // <-- Import Token Model

dotenv.config();

const clientId = process.env.SLACK_CLIENT_ID!;
const clientSecret = process.env.SLACK_CLIENT_SECRET!;
const redirectUri = process.env.SLACK_REDIRECT_URI!;

// STEP 1: Redirect to Slack OAuth
export const slackOAuthRedirect = (req: Request, res: Response) => {
  const slackUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=chat:write,channels:read&redirect_uri=${redirectUri}`;
  res.redirect(slackUrl);
};

// STEP 2: Slack OAuth Callback & Store Token in MongoDB
export const slackOAuthCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
      params: {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      },
    });

    if (!response.data.ok) {
      return res.status(400).json({ error: 'Slack OAuth failed', details: response.data });
    }

    const { access_token, team } = response.data;

    console.log('Access Token:', access_token);
    console.log('Connected Workspace:', team.name);

    // 🟢 Save token in DB (Upsert if workspace already exists)
    await Token.findOneAndUpdate(
      { workspace: team.name },
      { accessToken: access_token, workspace: team.name },
      { upsert: true, new: true }
    );

    // Respond success
    res.json({
      message: 'OAuth Success!',
      workspace: team.name
    });

  } catch (error) {
    console.error('OAuth Callback Error:', error);
    res.status(500).send('OAuth Callback Failed');
  }
};
