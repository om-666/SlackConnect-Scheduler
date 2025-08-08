import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css"; // Import the CSS file

const BACKEND_URL =
  "https://slackconnect-scheduler.onrender.com/messages/slack/credentials";

const LandingPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [slackClientId, setSlackClientId] = useState("");
  const [slackClientSecret, setSlackClientSecret] = useState("");

  const features = [
    "Secure OAuth 2.0 Integration",
    "Instant Message Delivery",
    "Smart Scheduling System",
    "Real-time Token Management",
  ];

  // Rotating features animation
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const savedClientId = localStorage.getItem("SLACK_CLIENT_ID");
    const savedClientSecret = localStorage.getItem("SLACK_CLIENT_SECRET");
    if (savedClientId) setSlackClientId(savedClientId);
    if (savedClientSecret) setSlackClientSecret(savedClientSecret);
  }, []);

  // Send credentials to backend
  const sendCredentialsToBackend = async (
    clientId: string,
    clientSecret: string
  ) => {
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, clientSecret }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save credentials to backend");
      }
      return { success: true };
    } catch (err: any) {
      alert("Failed to save Slack credentials to backend: " + err.message);
      return { success: false };
    }
  };

  const handleSave = async () => {
    if (slackClientId.trim() && slackClientSecret.trim()) {
      localStorage.setItem("SLACK_CLIENT_ID", slackClientId.trim());
      localStorage.setItem("SLACK_CLIENT_SECRET", slackClientSecret.trim());
      const result = await sendCredentialsToBackend(
        slackClientId.trim(),
        slackClientSecret.trim()
      );
      if (result.success) {
        alert("Slack credentials saved successfully!");
      }
    } else {
      alert("Please enter both Client ID and Client Secret");
    }
  };

  const handleAdd = async () => {
    if (!slackClientId.trim() || !slackClientSecret.trim()) {
      alert("Please enter both Client ID and Client Secret");
      return;
    }
    await handleSave();
  };

  return (
    <div className="landing-container">
      {/* Animated Background */}
      <div className="bg-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isVisible ? "visible" : ""}`}>
        {/* Slack Configuration Form */}
        <div className="config-form">
          <div className="form-header">
            <h3 className="form-title">Slack Configuration Setup</h3>
            <p className="form-instructions">
              Please enter your Slack app credentials to get started.
              <br />
              You can find these in your Slack app dashboard.
            </p>
          </div>
          <form className="credentials-form">
            <div className="form-group">
              <label htmlFor="slack-client-id" className="form-label">
                Enter Your Slack Client ID
              </label>
              <input
                id="slack-client-id"
                type="text"
                className="form-input"
                value={slackClientId}
                onChange={(e) => setSlackClientId(e.target.value)}
                placeholder="e.g., 1234567890.1234567890"
                required
              />
              <small className="form-help">
                Found in your Slack app settings under "App Credentials"
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="slack-client-secret" className="form-label">
                Enter Your Slack Client Secret
              </label>
              <input
                id="slack-client-secret"
                type="password"
                className="form-input"
                value={slackClientSecret}
                onChange={(e) => setSlackClientSecret(e.target.value)}
                placeholder="Enter your client secret"
                required
              />
              <small className="form-help">
                Keep this secret secure - never share it publicly
              </small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="form-btn add-btn"
                onClick={handleAdd}
              >
                Add Credentials
              </button>
              <button
                type="button"
                className="form-btn save-btn"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="hero-section">
          <div className="logo-container">
            <div className="slack-icon">💬</div>
            <h1 className="brand-title">
              Slack<span className="highlight">Connect</span>
            </h1>
          </div>

          <p className="tagline">
            The Ultimate Slack Messaging & Scheduling Platform
          </p>

          <div className="feature-rotator">
            <span className="feature-prefix">✨ </span>
            <span className="rotating-feature">
              {features[currentFeature]}
            </span>
          </div>

          <div className="cta-section">
            <button
              className="primary-btn"
              onClick={() =>
                window.open(
                  "https://slackconnect-scheduler.onrender.com/auth/slack",
                  "_blank"
                )
              }
            >
              <span>Connect Workspace</span>
              <div className="btn-animation"></div>
            </button>

             <button
              className="secondary-btn"
              onClick={() =>
              window.open(
                "https://drive.google.com/file/d/1FLOHzqPAKWy1aEChmL5zYsUTj-qBCipV/view?usp=sharing",
                "_blank"
              )
              }
            >
              View Demo
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="features-grid">
          <Link
            to="/send"
            className="feature-card card-4 no-underline-link"
          >
            <div className="card-icon">⚡</div>
            <h3>Instant Messaging</h3>
            <p>Send messages to any channel immediately</p>
          </Link>

          <Link
            to="/Schedule"
            className="feature-card card-3 no-underline-link"
          >
            <div className="card-icon">📅</div>
            <h3>Smart Scheduling</h3>
            <p>Schedule messages for perfect timing</p>
          </Link>

          <Link
            to="/Scheduled"
            className="feature-card card-4 no-underline-link"
          >
            <div className="card-icon">🎯</div>
            <h3>Message Management</h3>
            <p>Track and control all scheduled messages</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
