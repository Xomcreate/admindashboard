// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Investors from "./pages/Investors";
import Investments from "./pages/Investments";
import Withdrawals from "./pages/Withdrawals";
import Bonuses from "./pages/Bonuses";
import BlockedAccounts from "./pages/BlockedAccounts";
import UserDashboard from "./pages/UserDashboard";
import UserInvestments from "./pages/UserInvestments";
import UserWithdrawals from "./pages/UserWithdrawals";
import Profile from "./pages/Profile";
import FundAccount from "./pages/FundAccount";
import InvestmentPlans from "./pages/InvestmentPlans";
import CopyTrading from "./pages/CopyTrading";
import AITradingBots from "./pages/AITradingBots";
import PurchaseStocks from "./pages/PurchaseStocks";
import ProfitHistory from "./pages/ProfitHistory";
import Referrals from "./pages/Referrals";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import ProtectedRoute from "./routes/ProtectedRoute";
import Loader from "./MainComponets/Loader";

function RoleRedirect() {
  const role = localStorage.getItem("role");
  if (role === "admin") return <Navigate to="/dashboard" replace />;
  if (role === "user") return <Navigate to="/user/dashboard" replace />;
  return <Navigate to="/" replace />;
}

function AdminRoute({ children }) {
  const role = localStorage.getItem("role");
  if (role !== "admin") return <Navigate to="/user/dashboard" replace />;
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function UserRoute({ children }) {
  const role = localStorage.getItem("role");
  if (role !== "user") return <Navigate to="/dashboard" replace />;
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <BrowserRouter>
      {/*
        Base is DARK — bg-[#0d0c0c] text-white
        Light mode overrides via dark: prefix absence + CSS overrides in index.css
      */}
      <div className="min-h-screen bg-[#0d0c0c] text-white dark:bg-[#0d0c0c] dark:text-white">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<RoleRedirect />} />

          <Route path="/dashboard"  element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/investors"  element={<AdminRoute><Investors /></AdminRoute>} />
          <Route path="/investments"element={<AdminRoute><Investments /></AdminRoute>} />
          <Route path="/withdrawals"element={<AdminRoute><Withdrawals /></AdminRoute>} />
          <Route path="/bonuses"    element={<AdminRoute><Bonuses /></AdminRoute>} />
          <Route path="/blocked"    element={<AdminRoute><BlockedAccounts /></AdminRoute>} />

          <Route path="/user/dashboard"   element={<UserRoute><UserDashboard /></UserRoute>} />
          <Route path="/user/investments" element={<UserRoute><UserInvestments /></UserRoute>} />
          <Route path="/user/withdrawals" element={<UserRoute><UserWithdrawals /></UserRoute>} />

          <Route path="/fund-account"    element={<ProtectedRoute><FundAccount /></ProtectedRoute>} />
          <Route path="/investment-plans"element={<ProtectedRoute><InvestmentPlans /></ProtectedRoute>} />
          <Route path="/copy-trading"    element={<ProtectedRoute><CopyTrading /></ProtectedRoute>} />
          <Route path="/ai-trading-bots" element={<ProtectedRoute><AITradingBots /></ProtectedRoute>} />
          <Route path="/purchase-stocks" element={<ProtectedRoute><PurchaseStocks /></ProtectedRoute>} />
          <Route path="/profit-history"  element={<ProtectedRoute><ProfitHistory /></ProtectedRoute>} />
          <Route path="/referrals"       element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
          <Route path="/transactions"    element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/profile"         element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings"        element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          <Route path="*" element={<RoleRedirect />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;