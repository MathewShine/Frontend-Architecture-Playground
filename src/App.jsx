import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Dashboard from "./pages/Dashboard/Dashboard";
import EarningsPage from "./pages/Earnings/EarningsPage";
import EconomicEventsPage from "./pages/EconomicEvents/EconomicEventsPage";
import NewsEvents from "./pages/NewsEvents/NewsEvents";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/Login/LoginPage";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route 
            path="/dashboard" 
            element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />} 
          />
          <Route 
            path="/earnings" 
            element={<EarningsPage darkMode={darkMode} setDarkMode={setDarkMode} />} 
          />
          <Route 
            path="/economic-events" 
            element={<EconomicEventsPage darkMode={darkMode} setDarkMode={setDarkMode} />} 
          />
          <Route 
            path="/news-events" 
            element={<NewsEvents darkMode={darkMode} setDarkMode={setDarkMode} />} 
          />
          <Route 
            path="/landing" 
            element={<LandingPage darkMode={darkMode} setDarkMode={setDarkMode} />} 
          />
          <Route 
            path="/login" 
            element={<LoginPage darkMode={darkMode} setDarkMode={setDarkMode} />} 
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;