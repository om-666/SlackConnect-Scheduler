import React, { useState, useEffect } from "react";

type OnboardingProps = {
  onStart?: () => void;
};

const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const handleStart = () => {
    setCurrentStep(0);
    if (onStart) onStart();
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  const steps = [
    // ...[Steps as in your code]...
    {
      title: "Create or Select Your Slack App",
      content: (
        <div className="step-content-box">
          <p>Get started by setting up your Slack application:</p>
          <div className="action-list">
            <div className="action-item">
              <span className="step-number">1</span>
              <span>Visit <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="inline-link">https://api.slack.com/apps</a></span>
            </div>
            <div className="action-item">
              <span className="step-number">2</span>
              <span>Log in to your Slack account</span>
            </div>
            <div className="action-item">
              <span className="step-number">3</span>
              <span>Click your existing app (e.g., <em>SlackConnectScheduler</em>) or <strong>Create New App</strong></span>
            </div>
          </div>
        </div>
      )
    },
    // ... [rest of your steps unchanged, so you can paste from your code above] ...
    {
      title: "Add Basic App Info",
      content: (
        <div className="step-content-box">
          <p>Configure your app's basic information:</p>
          <div className="action-list">
            <div className="action-item">
              <span className="step-number">1</span>
              <span>Navigate to <strong>Basic Information</strong> in the sidebar</span>
            </div>
            <div className="action-item">
              <span className="step-number">2</span>
              <span>Copy your <span className="highlight-text">Client ID</span> and <span className="highlight-text">Client Secret</span></span>
            </div>
            <div className="action-item">
              <span className="step-number">3</span>
              <span>Paste these values into your Slack Connect Scheduler setup form</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Configure OAuth & Permissions",
      content: (
        <div className="step-content-box">
          <div className="section-box">
            <h4>Add Redirect URL:</h4>
            <div className="code-block">
              https://slackconnect-scheduler.onrender.com/auth/slack/callback
            </div>
            <p className="note">Click <strong>Add</strong> then <strong>Save Changes</strong></p>
          </div>
          
          <div className="section-box">
            <h4>Required Bot Token Scopes:</h4>
            <div className="scopes-container">
              <div className="scope-item">
                <div className="scope-header">
                  <span className="scope-name">channels:read</span>
                  <span className="scope-badge">Public Channels</span>
                </div>
                <p className="scope-desc">View public channel information for message targeting</p>
              </div>
              <div className="scope-item">
                <div className="scope-header">
                  <span className="scope-name">chat:write</span>
                  <span className="scope-badge">Core Feature</span>
                </div>
                <p className="scope-desc">Send messages as the bot to channels and users</p>
              </div>
              <div className="scope-item">
                <div className="scope-header">
                  <span className="scope-name">groups:read</span>
                  <span className="scope-badge">Private Channels</span>
                </div>
                <p className="scope-desc">View private channel information when invited</p>
              </div>
              <div className="scope-item">
                <div className="scope-header">
                  <span className="scope-name">groups:write</span>
                  <span className="scope-badge">Management</span>
                </div>
                <p className="scope-desc">Manage private channels and organize communications</p>
              </div>
              <div className="scope-item">
                <div className="scope-header">
                  <span className="scope-name">im:write</span>
                  <span className="scope-badge">Direct Messages</span>
                </div>
                <p className="scope-desc">Send direct messages for private notifications</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Enable App Distribution",
      content: (
        <div className="step-content-box">
          <p>Make your app available for installation:</p>
          <div className="action-list">
            <div className="action-item">
              <span className="step-number">1</span>
              <span>Go to <strong>Manage Distribution</strong> section</span>
            </div>
            <div className="action-item">
              <span className="step-number">2</span>
              <span>Click <strong>Activate Public Distribution</strong></span>
            </div>
            <div className="action-item">
              <span className="step-number">3</span>
              <span>Complete all required steps and save changes</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Install App to Workspace",
      content: (
        <div className="step-content-box">
          <p>Install your app to start using it:</p>
          <div className="action-list">
            <div className="action-item">
              <span className="step-number">1</span>
              <span>Click <strong>Install App to Workspace</strong> in your app settings</span>
            </div>
            <div className="action-item">
              <span className="step-number">2</span>
              <span>Follow the authorization prompts</span>
            </div>
            <div className="action-item">
              <span className="step-number">3</span>
              <span>Grant the requested permissions</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Invite Bot to Channel",
      content: (
        <div className="step-content-box">
          <p>Add your bot to the channels where you want to send messages:</p>
          <div className="action-list">
            <div className="action-item">
              <span className="step-number">1</span>
              <span>Open the target channel in Slack</span>
            </div>
            <div className="action-item">
              <span className="step-number">2</span>
              <span>Type: <span className="code-inline">/invite @your-bot-name</span></span>
            </div>
            <div className="action-item">
              <span className="step-number">3</span>
              <span>Replace <span className="code-inline">@your-bot-name</span> with your actual bot username</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Find Channel ID",
      content: (
        <div className="step-content-box">
          <p>Get the Channel ID for API usage:</p>
          <div className="action-list">
            <div className="action-item">
              <span className="step-number">1</span>
              <span>Click on the channel name at the top</span>
            </div>
            <div className="action-item">
              <span className="step-number">2</span>
              <span>Select "More" → "View channel details"</span>
            </div>
            <div className="action-item">
              <span className="step-number">3</span>
              <span>Copy the <span className="highlight-text">Channel ID</span> (e.g., <span className="code-inline">C0998DF9XKM</span>)</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Setup Complete!",
      content: (
        <div className="step-content-box">
          <div className="success-content">
            <h3>Congratulations! Your Slack Connect Scheduler is ready to use</h3>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Authorize your workspace</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Send instant messages</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Schedule future messages</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Manage all your communications</span>
              </div>
            </div>
            <div className="help-note">
              <strong>Need help?</strong> Double-check each step and verify that your bot is invited to the relevant channels.
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className={`onboarding-container ${isVisible ? 'visible' : ''}`}>
      {/* BACK Button */}
       

      <div className="onboarding-header">
        <div className="header-content">
          <h1>
            <span role="img" aria-label="zap" className="header-icon">⚡</span>
            Slack Connect Scheduler
          </h1>
          <p className="header-subtitle">Complete Setup Guide</p>
        </div>
        <button
          className="start-btn"
          onClick={() => {
            handleStart();
            window.location.href = "/landingpage";
          }}
        >
          <span>Start Setup</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <span>Progress: {completedSteps.length} of {steps.length} completed</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`step-card ${completedSteps.includes(index) ? 'completed' : ''} ${currentStep === index ? 'active' : ''}`}
            style={{ animationDelay: `${index * 0.07}s` }}
          >
            <div className="step-header">
              <div className="step-indicator">
                <span className="step-number">{index + 1}</span>
              </div>
              <h3>{step.title}</h3>
              <button 
                className="complete-btn"
                onClick={() => handleStepComplete(index)}
                disabled={completedSteps.includes(index)}
                title="Mark step as completed"
              >
                {completedSteps.includes(index) ? "✓" : ""}
              </button>
            </div>
            <div className="step-body">{step.content}</div>
          </div>
        ))}
      </div>

      {/* --- INLINE PREMIUM CSS --- */}
      <style>{`
      .onboarding-container {
        min-height: 100vh;
        background: linear-gradient(120deg, #667eea 0%, #764ba2 100%);
        padding: 0;
        margin: 0;
        position: relative;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        z-index: 0;
        transition: background 0.7s;
        animation: fadeInPage 0.8s;
      }

      @keyframes fadeInPage {
        0% { opacity: 0; filter: blur(10px);}
        100% { opacity: 1; filter: blur(0);}
      }

      .back-btn {
        position: fixed;
        top: 2rem;
        left: 2rem;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 1.5px solid rgba(255, 255, 255, 0.25);
        border-radius: 50px;
        padding: 0.8rem 1.5rem;
        color: white;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }
      .back-btn:hover {
        background: rgba(255,255,255,0.25);
        border-color: rgba(255,255,255,0.4);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      }
      .back-arrow {
        font-size: 1.2rem;
        transition: transform 0.3s ease;
      }
      .back-btn:hover .back-arrow {
        transform: translateX(-3px);
      }
      .back-text {
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      .onboarding-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 3rem 3rem 1.2rem 3rem;
        max-width: 1090px;
        margin: 0 auto;
        position: relative;
      }
      .header-content h1 {
        font-size: 2.7rem;
        font-weight: 900;
        letter-spacing: -0.5px;
        margin-bottom: 0.1em;
        background: linear-gradient(90deg, #ffd93d 15%, #ff6b6b 77%, #4ecdc4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        animation: pulseGlow 2.4s infinite;
      }
      @keyframes pulseGlow {
        0%,100% { filter: drop-shadow(0 0 0px #ffd93dc0);}
        50% { filter: drop-shadow(0 0 16px #ffd93dc0);}
      }
      .header-icon { font-size: 2.1rem; }
      .header-subtitle {
        color: #f8fafc;
        font-weight: 500;
        opacity: 0.93;
        font-size: 1.28rem;
        margin-top: -0.3em;
      }
      .start-btn {
        background: linear-gradient(100deg, #ff6b6b, #ffd93d, #4ecdc4);
        background-size: 220% 100%;
        background-position: 10% 50%;
        color: #fff;
        font-size: 1.1rem;
        font-weight: bold;
        padding: 1rem 2.5rem;
        border-radius: 40px;
        border: none;
        cursor: pointer;
        transition: background 0.35s, transform 0.25s;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 4px 18px 0 #ff6b6b29;
        z-index: 4;
        overflow: hidden;
        margin-left: 2rem;
      }
      .start-btn:hover, .start-btn:focus {
        background-position: 88% 10%;
        transform: translateY(-2px) scale(1.03);
      }
      .btn-arrow {
        background: linear-gradient(60deg, #ffd93d, #ff6b6b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 1.5em;
        font-weight: 700;
        margin-left: 0.3em;
        animation: arrowMove 1.2s infinite;
      }
      @keyframes arrowMove {
        0%,100% { transform: translateX(0);}
        60% { transform: translateX(6px);}
      }

      .progress-section {
        margin: 0 auto 2.7rem auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 95%;
        max-width: 900px;
      }
      .progress-info {
        color: #fff4;
        font-size: 1.08rem;
        font-weight: 600;
        margin-bottom: 0.4rem;
        letter-spacing: 0.04em;
      }
      .progress-bar {
        width: 100%;
        background: rgba(255,255,255,0.13);
        border-radius: 12px;
        height: 13px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(255, 255, 255, 0.07);
      }
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff6b6b, #ffd93d, #4ecdc4 85%);
        border-radius: 12px 0 0 12px;
        transition: width 0.65s cubic-bezier(.17,.67,.83,.67);
        box-shadow: 0 2px 16px #ffd93d33;
      }

      .steps-container {
        margin: 0 auto 2.8rem auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(385px, 1fr));
        gap: 2.5rem 2.5rem;
        max-width: 1120px;
        z-index: 3;
      }

      .step-card {
        background: rgba(255,255,255,0.13);
        border: 1.7px solid rgba(255,255,255,0.17);
        border-radius: 22px;
        box-shadow: 0 6px 32px 0 #ffbb1e16;
        padding: 2.1rem 1.6rem 1.5rem 1.6rem;
        margin-bottom: 0.2em;
        position: relative;
        animation: fadeInCard 0.77s cubic-bezier(.3,.68,.25,1.25) both;
        animation-delay: 0.07s;
        will-change: opacity,transform;
        display: flex;
        flex-direction: column;
        min-height: 245px;
        min-width: 0;
        transition: border-color 0.23s, box-shadow 0.23s, background 0.23s;
      }
      @keyframes fadeInCard {
        0% { opacity:0; transform: translateY(35px) scale(0.92);}
        100% { opacity:1; transform: translateY(0) scale(1);}
      }
      .step-card.active {
        border-color: #ffd93dcc;
        background: rgba(255,255,255,0.17);
        box-shadow: 0 10px 38px 0 #ffd93d33;
      }
      .step-card.completed {
        border-color: #59ecaa99;
        background: rgba(230,255,249,0.11);
      }

      .step-header {
        display: flex;
        align-items: center;
        gap: 1.15rem;
        margin-bottom: 1.25rem;
      }
      .step-indicator {
        background: linear-gradient(60deg, #ffd93d 60%, #4ecdc4);
        color: #3a345f;
        min-width: 36px;
        min-height: 36px;
        border-radius: 50%;
        font-weight: 900;
        font-size: 1.32rem;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1.7px 7px 0 #ffd93d48;
        margin-right: 2px;
      }

      .complete-btn {
        margin-left: auto;
        font-size: 1.29rem;
        width: 36px;
        height: 36px;
        background: linear-gradient(40deg,#ffd93d, #59ecaa 65%);
        color: #fff;
        border: none;
        border-radius: 50%;
        font-weight: 700;
        box-shadow: 0 2.5px 8px #ffd93d15;
        cursor: pointer;
        transition: transform 0.22s, background 0.21s;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .complete-btn:disabled {
        background: #e2f9eaa8;
        color: #fff;
        cursor: default;
        opacity: 0.6;
      }

      .step-header h3 {
        font-size: 1.19rem;
        font-weight: 800;
        color: #fff;
        margin: 0;
        flex: 1;
        letter-spacing: 0;
      }
      .step-body {
        color: #fff;
        font-size: 1.08rem;
        font-weight: 400;
        opacity: 0.97;
        padding-left: 5px;
        padding-right: 0.2em;
      }

      /* Sub-content for steps */
      .step-content-box {
        margin-top: 0.2em;
      }
      .action-list {
        margin-top: 0.5em;
        display: flex;
        flex-direction: column;
        gap: 0.75em;
      }
      .action-item {
        display: flex;
        align-items: flex-start;
        gap: 0.7em;
        font-size: 1.04rem;
        transition: filter 0.2s;
      }
      .action-item:hover .step-number {
        filter: brightness(1.18);
        transform: scale(1.09) translateY(-2px);
      }
      .step-number {
        min-width: 28px;
        min-height: 28px;
        font-size: 1.11em;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(60deg, #ffd93d, #ff6b6b 70%);
        color: #fff;
        border-radius: 50%;
        box-shadow: 0 0.7px 3px #ffd93d29;
        margin-right: 0.45em;
        transition: background 0.35s, filter 0.16s, transform 0.16s;
        border: none;
      }
      .highlight-text {
        background: linear-gradient(90deg, #ffd93d, #ff6b6b 80%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
        font-size: 1.08em;
      }
      .inline-link {
        color: #ffd93d;
        font-weight: 700;
        text-decoration: underline;
        transition: color 0.19s;
      }
      .inline-link:hover, .inline-link:focus {
        color: #ff6b6b;
        outline: none;
      }
      .code-inline {
        font-size: 0.98em;
        font-family: 'Fira Mono', 'Monaco', 'Menlo', monospace;
        background: rgba(255,255,255,0.13);
        border-radius: 6px;
        padding: 0.09em 0.41em;
        color: #ffd93d;
        margin: 0 0.14em;
      }
      .code-block {
        font-family: monospace;
        font-size: 1.01em;
        background: rgba(255,255,255,0.11);
        border-radius: 7px;
        padding: 0.43em 0.95em;
        display: inline-block;
        margin: 0.7em 0 !important;
        color: #ffd93d;
      }
      .note {
        font-size: 0.97em;
        margin: 0.19em 0;
        color: #fff8;
      }
      .section-box {
        margin-bottom: 1.2em;
      }
      .scopes-container {
        display: flex;
        flex-direction: column;
        gap: 1em;
      }
      .scope-item {
        background: rgba(255,255,255,0.07);
        border-radius: 8px;
        padding: 0.6em 1em;
        box-shadow: 0 2px 4px #ffd93d20;
      }
      .scope-header {
        display: flex;
        gap: 1.31em;
        font-size: 1.05em;
        font-weight: 700;
        align-items: center;
        margin-bottom: 0.16em;
      }
      .scope-name {
        color: #ffd93d;
        font-weight: 900;
      }
      .scope-badge {
        background: linear-gradient(60deg, #4ecdc4, #ffd93d);
        font-size: 0.99em;
        font-weight: 650;
        color: #393;
        border-radius: 7px;
        padding: 0.22em 0.75em;
        opacity: 0.88;
      }
      .scope-desc {
        font-size: 0.97em;
        color: #fffad7;
        margin-left: 2px;
        opacity: 0.91;
      }

      /* Setup Complete/Success */
      .success-content {
        padding: 0.12em 0 0.2em 0;
      }
      .feature-list {
        margin: 1em 0 1.2em 0;
        display: flex;
        flex-direction: column;
        gap: 0.71em;
      }
      .feature-item {
        display: flex;
        align-items: center;
        font-weight: 600;
        color: #fffde6;
        font-size: 1.08rem;
      }
      .feature-dot {
        width: 19px;
        height: 19px;
        background: linear-gradient(60deg, #ff6b6b, #ffd93d 70%);
        border-radius: 50%;
        display: inline-block;
        margin-right: 0.67em;
        box-shadow: 0 0 6px #ffd93d44;
        animation: featureDotPulse 1.6s infinite;
      }
      @keyframes featureDotPulse {
        0%,100% { filter: brightness(1.2);}
        50% { filter: brightness(1.5);}
      }
      .help-note {
        color: #ffd93d;
        font-weight: 700;
        background: rgba(255,255,255,0.06);
        border-radius: 8px;
        padding: 0.7em 1.2em;
        font-size: 1rem;
        margin-top: 1em;
      }

      /* Animations and transitions */
      .onboarding-container.visible {
        animation: fadeInPage 0.7s;
      }

      /* RESPONSIVE */
      @media (max-width: 1100px) {
        .steps-container {
          grid-template-columns: 1fr;
        }
        .onboarding-header { flex-direction: column; gap: 2rem; text-align: center;}
        .start-btn { margin-left: 0; }
      }
      @media (max-width: 700px) {
        .onboarding-header { padding: 2rem 0.4rem 1rem 0.4rem;}
        .progress-section { padding-left: 0.7rem; padding-right: 0.7rem; }
        .steps-container { gap: 1.2rem 0.5rem; }
      }
      @media (max-width: 500px) {
        .back-btn { top: 1rem; left: 1rem; font-size: 0.97rem; padding: 0.62rem 1.08rem;}
        .onboarding-header { padding: 1.15rem 0.12rem 0.8rem 0.12rem;}
      }
      `}</style>
    </div>
  );
};

export default Onboarding;
