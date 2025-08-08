# SlackConnect Scheduler

**SlackConnect Scheduler** is a robust full-stack application designed to securely connect to Slack workspaces using OAuth 2.0. With this tool, users can send instant messages, schedule messages for future delivery, and manage all scheduled communications efficiently. It features secure token management, a reliable scheduler, and a lightweight MongoDB database for persistence. The project is built with modern technologies: TypeScript, Node.js, Express, MongoDB, and a React frontend.

---

## Features

- **Secure OAuth 2.0 Integration:** Safely connect your Slack workspace using industry-standard authentication.
- **Instant Messaging:** Quickly send messages to any Slack channel.
- **Message Scheduling:** Schedule messages for future delivery with flexible options.
- **Token Management:** Each workspace’s tokens are stored and managed securely.
- **Scheduled Message Management:** View, edit, or delete any upcoming scheduled messages.
- **Reliable Dispatch:** Backend scheduler ensures messages are delivered promptly and reliably.

---

## Live Demo

Check out the live application: [https://slack-connect-scheduler.vercel.app](https://slack-connect-scheduler.vercel.app)

---

## Technologies Used

- **Frontend:** React (Create React App), TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB (Mongoose)
- **Other:** OAuth 2.0, node-cron for scheduling

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Access to a MongoDB instance (local or cloud)
- Slack App credentials (Client ID & Client Secret)

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/om-666/SlackConnect-Scheduler.git
cd SlackConnect-Scheduler
```

## 2. Configure Environment Variables

1. In the `slack-connect-backend` directory, create a file named `.env`.
2. In the codebase, locate the existing `env-text` file. Copy all of its contents and paste them into the newly created `.env` file.
3. Ensure your connection strings and secrets (e.g., `MONGO_URI`, `SLACK_REDIRECT_URI`,`PORT`) are correct in the `.env` file.
4. Restart the backend service to apply the changes.

### Notes
- The backend should now read environment variables from the `.env` file instead of `env-text`.
- If the application code explicitly reads from `env-text`, update it to load from `.env` (e.g., using `dotenv`) or ensure your process manager loads `.env`.

#### 3. Install Dependencies

```bash
cd slack-connect-backend
npm install

cd ../slack-connect-frontend
npm install
```

#### 4. Run the Backend

```bash
npm run dev
```

#### 5. Run the Frontend

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

---

## Usage

1. **Authorize Workspace:** Enter your Slack App credentials to connect.
2. **Send Messages:** Use the dashboard to send instant messages to channels.
3. **Schedule Messages:** Set a future time to schedule a message.
4. **Manage Scheduled Messages:** Edit, view, or delete scheduled communications.

---

## Onboarding Steps

- Go to [Slack API Apps](https://api.slack.com/apps) and create/select your Slack App.
- Copy your Client ID and Client Secret from "Basic Information."
- Paste these credentials into the app during setup.
- Configure OAuth & Permissions, including redirect URLs.
- Invite the bot to all required channels.
- Start using SlackConnect Scheduler!

---

## Scripts

Run these commands in `slack-connect-frontend` or `slack-connect-backend`:

- `npm start` – Run in development mode.
- `npm test` – Launch test runner.
- `npm run build` – Build for production.
- `npm run eject` (frontend only) – Eject Create React App config.

---

## Deployment

For deployment guides, check [Create React App documentation](https://facebook.github.io/create-react-app/docs/deployment) and [React documentation](https://reactjs.org/).

---

## License

_No license specified yet. Please add one before sharing or distributing._

---

## Need Help?

- Verify setup steps and credentials.
- Ensure the bot is invited to your Slack channels.
- Check backend/frontend logs for errors.

---

## Contributing

Contributions, suggestions, and bug reports are welcome! Please open an issue or submit a pull request.

---

## Author

- [om-666](https://github.com/om-666)
