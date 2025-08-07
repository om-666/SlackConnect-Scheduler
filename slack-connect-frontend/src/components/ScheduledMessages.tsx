import React, { useEffect, useState } from "react";
import { RingLoader, PulseLoader, BeatLoader } from "react-spinners";
import "./ScheduledMessages.css";

type ScheduledMessage = {
  _id: string;
  workspace: string;
  channelId: string;
  message: string;
  sendAt: string;
  __v: number;
};

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(Math.abs(Math.sin(hash) * 16777215) % 16777215).toString(16);
  return "#" + "000000".substring(0, 6 - color.length) + color;
}

const ScheduledMessages: React.FC = () => {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Workspace input state
  const [workspaceName, setWorkspaceName] = useState("");
  // To track when user submitted (so we don't fire on every keystroke)
  const [lastSubmittedWorkspace, setLastSubmittedWorkspace] = useState("");

  // Use POST per your spec!
  const fetchMessages = async (workspaceForFetch?: string) => {
    const workspace = workspaceForFetch !== undefined ? workspaceForFetch : workspaceName.trim();
    if (!workspace) {
      setMessages([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://slackconnect-scheduler.onrender.com/messages/scheduled", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace }),
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (data && Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else {
        setMessages([]);
      }
    } catch (err: any) {
      setError(err.message || "Error fetching messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Only fetch if a workspace is preset on mount (OPTIONAL)
  useEffect(() => {
    setIsVisible(true);
    // Optionally, auto-fetch messages on load if workspaceName is preset here
    // fetchMessages();
    // eslint-disable-next-line
  }, []);

  // Handler for pressing Enter in input or clicking "Search"
  const handleWorkspaceSearch = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (workspaceName.trim() && workspaceName.trim() !== lastSubmittedWorkspace) {
      setLastSubmittedWorkspace(workspaceName.trim());
      fetchMessages(workspaceName.trim());
    }
  };

  // Optional: allow blur to trigger search (remove if you only want search on button/enter)
  const handleInputBlur = () => {
    if (workspaceName.trim() && workspaceName.trim() !== lastSubmittedWorkspace) {
      setLastSubmittedWorkspace(workspaceName.trim());
      fetchMessages(workspaceName.trim());
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this scheduled message?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(
        `https://slackconnect-scheduler.onrender.com/messages/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete message");
      }
      setMessages(messages => messages.filter(m => m._id !== id));
    } catch (err: any) {
      alert(err.message || "Error deleting message");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/landingpage';
  };

  // The centered input box below Home
  const workspaceInputBox = (
    <form
      className="workspace-header-center"
      onSubmit={handleWorkspaceSearch}
      autoComplete="off"
      style={{ marginBottom: "2rem" }}
    >
      <label htmlFor="workspace-input" className="workspace-label">
        Enter your workspace name
      </label>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <input
          id="workspace-input"
          type="text"
          className="workspace-input"
          value={workspaceName}
          onChange={e => setWorkspaceName(e.target.value)}
          placeholder="Workspace name"
          onBlur={handleInputBlur}
        />
        <button
          type="submit"
          className="workspace-search-btn"
          style={{
            padding: "0.6em 1.3em",
            borderRadius: "1.2em",
            border: "1px solid #ffd93d",
            background: "#ffd93d",
            color: "#222",
            fontWeight: 600,
            fontSize: "1em",
            cursor: "pointer",
            outline: "none",
          }}
        >
          Search
        </button>
      </div>
    </form>
  );

  // Loader
  if (loading)
    return (
      <div className="msg-container" id="scheduled-messages">
        <button className="back-btn" onClick={handleBackToHome}>
          <span className="back-arrow">←</span>
          <span className="back-text">Home</span>
        </button>
        {workspaceInputBox}
        <div className="bg-animation">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
        </div>
        <div className="premium-loading-container">
          <div className="loading-stage">
            <div className="main-loader-wrapper">
              <RingLoader color="#ffd93d" loading={true} size={180} speedMultiplier={0.8} aria-label="Loading Spinner" />
              <div className="center-pulse-loader">
                <PulseLoader color="#ff6b6b" loading={true} size={20} margin={5} speedMultiplier={1.2} />
              </div>
            </div>
            <div className="loading-text-container">
              <h2 className="loading-title">
                Loading Messages
                <div className="title-beats">
                  <BeatLoader color="#4ecdc4" loading={true} size={12} margin={3} speedMultiplier={0.7} />
                </div>
              </h2>
              <p className="loading-subtitle">Fetching your scheduled messages...</p>
            </div>
          </div>
        </div>
      </div>
    );

  // Error display
  if (error)
    return (
      <div className="msg-container" id="scheduled-messages">
        <button className="back-btn" onClick={handleBackToHome}>
          <span className="back-arrow">←</span>
          <span className="back-text">Home</span>
        </button>
        {workspaceInputBox}
        <div className="bg-animation">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-text">Error: {error}</div>
          <button className="retry-btn" onClick={() => fetchMessages(lastSubmittedWorkspace)}>Try Again</button>
        </div>
      </div>
    );

  // Animated empty state
  if (workspaceName && !messages.length && !loading && !error)
    return (
      <div className="msg-container" id="scheduled-messages">
        <button className="back-btn" onClick={handleBackToHome}>
          <span className="back-arrow">←</span>
          <span className="back-text">Home</span>
        </button>
        {workspaceInputBox}
        <div className="bg-animation">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className="empty-container">
          <div className="empty-icon" aria-hidden="true">📭</div>
          <div className="empty-text">No scheduled messages found</div>
          <div className="empty-subtext">Try another workspace or schedule your first message!</div>
        </div>
      </div>
    );

  // Main content
  return (
    <div className="msg-container" id="scheduled-messages">
      {/* Home Button */}
      <button className="back-btn" onClick={handleBackToHome}>
        <span className="back-arrow">←</span>
        <span className="back-text">Home</span>
      </button>
      {workspaceInputBox}

      <div className="bg-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className={`main-content ${isVisible ? "visible" : ""}`}>
        <div className="msg-heading">
          <div className="heading-icon">📅</div>
          <h1 className="heading-title">
            Scheduled <span className="highlight">Messages</span>
          </h1>
          <p className="heading-subtitle">Manage all your upcoming Slack messages</p>
        </div>
        <div className="messages-grid">
          {messages.map((msg, index) => (
            <div key={msg._id} className={`msg-card card-${(index % 3) + 1}`}>
              <div className="card-header">
                <div
                  className="msg-avatar"
                  style={{ background: stringToColor(msg.workspace) }}
                  title={msg.workspace}
                >
                  {msg.workspace
                    .split(/\s/)
                    .map(w => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <button
                  className="msg-delete"
                  title="Delete scheduled message"
                  disabled={deletingId === msg._id}
                  onClick={() => handleDelete(msg._id)}
                >
                  {deletingId === msg._id ? (
                    <div className="delete-spinner"></div>
                  ) : (
                    "🗑️"
                  )}
                </button>
              </div>
              <div className="msg-content">
                <div className="msg-title">{msg.message}</div>
                <div className="msg-meta">
                  <div className="meta-item">
                    <span className="meta-label">💼 Workspace:</span>
                    <span className="meta-value">{msg.workspace}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">📢 Channel:</span>
                    <code className="channel-code">{msg.channelId}</code>
                  </div>
                </div>
                <div className="msg-time">
                  <div className="time-icon">⏰</div>
                  <div>
                    <div className="time-label">Scheduled for:</div>
                    <div className="time-value">
                      {new Date(msg.sendAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduledMessages;
