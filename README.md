# Live Demo of Application
[▶ Watch the video](https://drive.google.com/file/d/1FLOHzqPAKWy1aEChmL5zYsUTj-qBCipV/view?usp=sharing)

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



# SlackConnect-Scheduler: Architectural Overview

## System Architecture

The SlackConnect-Scheduler is a full-stack web application designed to schedule and automatically send messages to Slack channels. The system follows a **client-server architecture** with clear separation of concerns between frontend and backend components.

### High-Level Architecture

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   React Frontend │ ◄──────────────► │  Express Backend │
│   (TypeScript)   │                  │   (TypeScript)   │
└─────────────────┘                  └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   MongoDB Atlas │
                                    │   (Database)    │
                                    └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   Slack API     │
                                    │   (External)    │
                                    └─────────────────┘
```

## Backend Architecture

### 1. OAuth Flow & Token Management

The system implements **Slack OAuth 2.0** for secure workspace authentication:

#### OAuth Flow Sequence:
```
1. User initiates OAuth → /auth/slack
2. Redirect to Slack → https://slack.com/oauth/v2/authorize
3. User authorizes app → Slack redirects with code
4. Exchange code for token → /auth/slack/callback
5. Store token in MongoDB → Token collection
```

#### Token Management Design:
- **Workspace-based token storage**: Each Slack workspace has a unique token
- **Secure token handling**: Tokens are stored encrypted in MongoDB
- **Token lifecycle**: Tokens persist until workspace re-authenticates
- **Scope management**: Required scopes: `chat:write`, `channels:read`

#### Key Components:
```typescript
// Token Model (MongoDB Schema)
interface IToken {
    accessToken: string;  // Slack OAuth access token
    workspace: string;    // Workspace identifier (unique)
}

// OAuth Controller Flow
export const slackOAuthRedirect = async (req, res) => {
    // 1. Build Slack authorization URL with scopes
    // 2. Redirect user to Slack
}

export const slackOAuthCallback = async (req, res) => {
    // 1. Exchange authorization code for access token
    // 2. Store token in MongoDB keyed by workspace
    // 3. Return success response
}
```

### 2. Scheduled Task Handling

The system uses a **cron-based scheduler** for reliable message delivery:

#### Scheduler Architecture:
```typescript
// Cron job runs every minute
cron.schedule('* * * * *', async () => {
    // 1. Find due messages (sendAt <= now, processing = false)
    // 2. Atomically lock message (processing = true)
    // 3. Fetch workspace token
    // 4. Send message via Slack API
    // 5. Delete on success or unlock for retry
});
```

#### Key Design Patterns:

**1. Atomic Job Processing:**
- Uses MongoDB's `findOneAndUpdate` for atomic locking
- Prevents duplicate message sending in multi-instance deployments
- Implements retry mechanism for failed deliveries

**2. Fault Tolerance:**
- Network failures unlock jobs for retry
- Slack API errors are logged and retried
- Graceful degradation with error handling

**3. Message Queue Pattern:**
- Messages stored in MongoDB as documents
- Processing flag prevents race conditions
- Automatic cleanup on successful delivery

#### Scheduled Message Model:
```typescript
interface IScheduledMessage {
    workspace: string;    // Workspace identifier
    channelId: string;    // Target Slack channel
    message: string;      // Message content
    sendAt: Date;         // Scheduled send time
    processing: boolean;   // Lock flag for workers
}
```

### 3. API Design

The backend exposes RESTful APIs with clear separation:

#### Route Structure:
```
/messages
├── POST /scheduled     # Create scheduled message
├── POST /scheduled     # Fetch scheduled messages (by workspace)
├── DELETE /:id         # Delete scheduled message
└── POST /send         # Send immediate message

/auth
├── GET /slack         # Initiate OAuth flow
└── GET /slack/callback # OAuth callback handler

/channels
└── POST /list         # Fetch workspace channels
```

#### API Design Principles:
- **Stateless**: No server-side session management
- **RESTful**: Standard HTTP methods and status codes
- **Workspace-scoped**: All operations require workspace identification
- **Error handling**: Consistent error responses with appropriate HTTP codes

## Frontend Architecture

### 1. React Component Structure

The frontend follows a **component-based architecture** with clear separation of concerns:

```
src/
├── components/
│   ├── Onboarding.tsx        # OAuth setup wizard
│   ├── ScheduledMessages.tsx # Message management UI
│   ├── ScheduleMessage.tsx   # Message creation form
│   ├── SendMessage.tsx       # Immediate message sending
│   └── ConnectSlack.tsx      # OAuth initiation
└── services/                 # API integration layer
```

### 2. State Management

- **Local component state**: Using React hooks for UI state
- **API state management**: Custom hooks for data fetching
- **Form state**: Controlled components with validation
- **Loading states**: Comprehensive loading indicators

### 3. User Experience Flow

```
1. Onboarding → OAuth Setup → Workspace Configuration
2. Message Scheduling → Channel Selection → Time Setting
3. Message Management → View/Edit/Delete Scheduled Messages
4. Immediate Sending → Quick Message Delivery
```

## Database Design

### MongoDB Collections:

**1. Tokens Collection:**
```javascript
{
    _id: ObjectId,
    accessToken: String,    // Encrypted Slack token
    workspace: String,      // Unique workspace identifier
    createdAt: Date,
    updatedAt: Date
}
```

**2. ScheduledMessages Collection:**
```javascript
{
    _id: ObjectId,
    workspace: String,      // Workspace identifier
    channelId: String,      // Slack channel ID
    message: String,        // Message content
    sendAt: Date,          // Scheduled timestamp
    processing: Boolean,    // Lock flag
    createdAt: Date,
    updatedAt: Date
}
```

**3. SlackAppCredentials Collection:**
```javascript
{
    _id: ObjectId,
    clientId: String,       // Slack app client ID
    clientSecret: String,   // Slack app client secret
    createdAt: Date,
    updatedAt: Date
}
```

## Security Considerations

### 1. OAuth Security
- **CSRF Protection**: State parameter validation (planned)
- **Secure redirect URIs**: Validated against registered URLs
- **Token encryption**: Sensitive tokens encrypted at rest
- **Scope limitation**: Minimal required permissions

### 2. API Security
- **CORS configuration**: Proper origin restrictions
- **Input validation**: Request payload sanitization
- **Error handling**: No sensitive data leakage
- **Rate limiting**: Protection against abuse (planned)

### 3. Data Security
- **MongoDB security**: Connection string encryption
- **Environment variables**: Sensitive config externalized
- **Token rotation**: Support for token refresh (planned)

## Scalability Considerations

### 1. Horizontal Scaling
- **Stateless design**: No session dependencies
- **Database scaling**: MongoDB Atlas for managed scaling
- **Load balancing**: Multiple backend instances supported

### 2. Performance Optimization
- **Database indexing**: Optimized queries for scheduled messages
- **Connection pooling**: MongoDB connection management

 

## Deployment Architecture

### Current Deployment:
- **Frontend**: React app deployed on Vercel
- **Backend**: Node.js/Express on Render.com
- **Database**: MongoDB Atlas (cloud-hosted)

### Environment Configuration:
```bash
# Required Environment Variables
SLACK_REDIRECT_URI=https://slackconnect-scheduler.onrender.com/auth/slack/callback
MONGODB_URI=mongodb+srv://ommtanmaya:Mulb1fXW4pLOZi0l@cluster0.w6zd38u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
```

## Technology Stack

### Backend:
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Scheduler**: node-cron for job scheduling
- **HTTP Client**: Axios for Slack API calls

### Frontend:
- **Framework**: React with TypeScript
- **Styling**: CSS modules with responsive design
- **HTTP Client**: Fetch API for backend communication
- **UI Components**: Custom components with loading states

### DevOps:
- **Version Control**: Git with GitHub
- **CI/CD**: Automated deployment pipelines
- **Monitoring**: Application logging and error tracking

 
This architecture provides a robust, scalable foundation for scheduled Slack messaging with secure OAuth integration and reliable message delivery.


# Flow Diagram 
<img width="752" height="691" alt="image" src="https://github.com/user-attachments/assets/f797c05b-b1df-4a97-90e3-ad96451bf643" />

