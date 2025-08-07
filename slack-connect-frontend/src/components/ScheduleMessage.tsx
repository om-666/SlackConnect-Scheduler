import React, { useState } from 'react';
import "./MessageScheduler.css";

interface ScheduleFormData {
  workspace: string;
  channelId: string;
  message: string;
  sendAt: string; // User enters IST time (e.g., YYYY-MM-DDTHH:mm)
}

const MessageScheduler: React.FC = () => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    workspace: '',
    channelId: '',
    message: '',
    sendAt: '',
  });

  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const convertIstToUtc = (istDateTime: string): string => {
    const date = new Date(`${istDateTime}:00+0530`);
    return date.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponse(null);
    setError(null);
    setLoading(true);

    if (!formData.workspace || !formData.channelId || !formData.message || !formData.sendAt) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const utcSendAt = convertIstToUtc(formData.sendAt);
      const payload = { ...formData, sendAt: utcSendAt };

      const res = await fetch('https://slackconnect-scheduler.onrender.com/messages/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to schedule message');
      }

      const data = await res.json();
      setResponse(`Message: ${data.message} | ID: ${data.id}`);
      setFormData({
        workspace: '',
        channelId: '',
        message: '',
        sendAt: '',
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/landingpage';
  };

  return (
    <div className="scheduler-bg">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      {/* Back Button */}
      <button className="back-btn" onClick={handleBackToHome}>
        <span className="back-arrow">←</span>
        <span className="back-text">Home</span>
      </button>

      <div className="scheduler-glass">
        <div className="scheduler-header">
          <div className="title-icon">⏰</div>
          <h1 className="scheduler-title">
            Schedule <span className="highlight">Message</span>
          </h1>
          <p className="scheduler-subtitle">
            Plan your Slack messages for future delivery
          </p>
        </div>

        <form className="scheduler-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">💼 Workspace</label>
            <input
              type="text"
              name="workspace"
              className="scheduler-input"
              placeholder="Enter workspace name"
              value={formData.workspace}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">📢 Channel ID</label>
            <input
              type="text"
              name="channelId"
              className="scheduler-input"
              placeholder="Enter channel ID"
              value={formData.channelId}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">💬 Message</label>
            <textarea
              name="message"
              className="scheduler-textarea"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              disabled={loading}
              rows={4}
              maxLength={500}
              required
            />
            <div className="char-count">{formData.message.length}/500</div>
          </div>

          <div className="input-group">
            <label className="input-label">⏰ Schedule Time (IST)</label>
            <input
              type="datetime-local"
              name="sendAt"
              className="scheduler-input datetime-input"
              value={formData.sendAt}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <div className="time-info">
              <small>🌏 Enter time in IST (UTC+5:30). It will be converted automatically.</small>
            </div>
          </div>

          <button
            type="submit"
            className={`scheduler-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loader"></span>
            ) : (
              <>Schedule <span className="schedule-arrow">📅</span></>
            )}
          </button>

          {error && <div className="scheduler-error">{error}</div>}
          {response && <div className="scheduler-success">{response}</div>}
        </form>
      </div>
    </div>
  );
};

export default MessageScheduler;
