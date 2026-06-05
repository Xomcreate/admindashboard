// src/App.jsx

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// AUTH
import Login from "./pages/Login";

// ADMIN / USER PAGES (your actual folder)
import Dashboard from "./pages/Dashboard";
import Investors from "./pages/Investors";
import Investments from "./pages/Investments";
import FundAccount from "./pages/FundAccount";
import InvestmentPlans from "./pages/InvestmentPlans";
import CopyTrading from "./pages/CopyTrading";
import AITradingBots from "./pages/AITradingBots";
import PurchaseStocks from "./pages/PurchaseStocks";
import ProfitHistory from "./pages/ProfitHistory";
import Referrals from "./pages/Referrals";
import Bonuses from "./pages/Bonuses";
import BlockedAccounts from "./pages/BlockedAccounts";
import Profile from "./pages/Profile";

// ROUTES
import ProtectedRoute from "./routes/ProtectedRoute";

// LOADER
import Loader from "./MainComponents/Loader";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />

        {/* MAIN DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* CORE FEATURES */}
        <Route path="/investors" element={<ProtectedRoute><Investors /></ProtectedRoute>} />
        <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
        <Route path="/fund-account" element={<ProtectedRoute><FundAccount /></ProtectedRoute>} />
        <Route path="/investment-plans" element={<ProtectedRoute><InvestmentPlans /></ProtectedRoute>} />
        <Route path="/copy-trading" element={<ProtectedRoute><CopyTrading /></ProtectedRoute>} />
        <Route path="/ai-trading-bots" element={<ProtectedRoute><AITradingBots /></ProtectedRoute>} />
        <Route path="/purchase-stocks" element={<ProtectedRoute><PurchaseStocks /></ProtectedRoute>} />
        <Route path="/profit-history" element={<ProtectedRoute><ProfitHistory /></ProtectedRoute>} />
        <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />

        {/* ADMIN */}
        <Route path="/bonuses" element={<ProtectedRoute><Bonuses /></ProtectedRoute>} />
        <Route path="/blocked" element={<ProtectedRoute><BlockedAccounts /></ProtectedRoute>} />

        {/* PROFILE */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;