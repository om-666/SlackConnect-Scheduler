import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import ScheduledMessages from "./components/ScheduledMessages";
import SendMessage from "./components/SendMessage";
import ScheduleMessage from "./components/ScheduleMessage";
import Onboarding from "./components/Onboarding";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/" element={<Onboarding />} />
        <Route path="/scheduled" element={<ScheduledMessages />} />
        <Route path="/send" element={<SendMessage />} />
        <Route path="/schedule" element={<ScheduleMessage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
