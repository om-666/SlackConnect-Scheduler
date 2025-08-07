import React, { useState } from 'react';
import API from './services/api';
import './SendMessage.css'; // Import the CSS file

const SendMessage: React.FC = () => {
  const [workspace, setWorkspace] = useState('');
  const [channelId, setChannelId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!workspace || !channelId || !message) {
      setError("All fields are required!");
      setSuccess(null);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await API.post('/messages/send', { workspace, channelId, message });
      setSuccess(res.data.message || "Message Sent!");
      setWorkspace('');
      setChannelId('');
      setMessage('');
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/landingpage'; // Redirect to the landing page
  };

  return (
    <div className="send-msg-bg">
      {/* Back Button */}
      <button className="back-btn" onClick={handleBackToHome}>
        <span className="back-arrow">←</span>
        <span className="back-text">Home</span>
      </button>

      <div className="send-msg-glass">
        <div className="send-msg-header">
          <div className="title-icon">⚡</div>
          <h1 className="send-msg-title">
            Send <span className="highlight">Instant</span> Message
          </h1>
          <p className="send-msg-subtitle">
            Deliver your message to Slack instantly
          </p>
        </div>
        
        <form className="send-msg-form" onSubmit={e => {e.preventDefault(); handleSend();}}>
          <input
            type="text"
            className="send-msg-input"
            placeholder="Workspace Name"
            value={workspace}
            onChange={e => setWorkspace(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <input
            type="text"
            className="send-msg-input"
            placeholder="Channel ID"
            value={channelId}
            onChange={e => setChannelId(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            className="send-msg-input"
            placeholder="Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            disabled={loading}
            maxLength={200}
          />
          <button
            type="submit"
            className={`send-msg-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ?
              <span className="btn-loader"></span>
              : <>Send <span className="send-arrow">→</span></>
            }
          </button>
          {error && <div className="send-msg-error">{error}</div>}
          {success && <div className="send-msg-success">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default SendMessage;
