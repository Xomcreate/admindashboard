// src/App.jsx

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// AUTH PAGES
import Login from "./pages/Login";
import Register from "./pages/Register";

// ADMIN PAGES
import Dashboard from "./pages/Dashboard";
import Investors from "./pages/Investors";
import Investments from "./pages/Investments";
import Withdrawals from "./pages/Withdrawals";
import Bonuses from "./pages/Bonuses";
import BlockedAccounts from "./pages/BlockedAccounts";

// USER PAGES
import UserDashboard from "./pages/UserDashboard";
import UserInvestments from "./pages/UserInvestments";
import UserWithdrawals from "./pages/UserWithdrawals";
import Profile from "./pages/Profile";

// SHARED PAGES (used by both admin & user via sidebar)
import FundAccount from "./pages/FundAccount";
import InvestmentPlans from "./pages/InvestmentPlans";
import CopyTrading from "./pages/CopyTrading";
import AITradingBots from "./pages/AITradingBots";
import PurchaseStocks from "./pages/PurchaseStocks";
import ProfitHistory from "./pages/ProfitHistory";
import Referrals from "./pages/Referrals";
import Transactions from "./pages/Transactions";

// SETTINGS
import Settings from "./pages/Settings";

// ROUTES
import ProtectedRoute from "./routes/ProtectedRoute";

// COMPONENTS
import Loader from "./MainComponets/Loader";

// ─────────────────────────────────────────────
// RoleRedirect: after login, send each role to
// their own dashboard automatically.
// ─────────────────────────────────────────────
function RoleRedirect() {
  const role = localStorage.getItem("role");
  if (role === "admin") return <Navigate to="/dashboard" replace />;
  if (role === "user") return <Navigate to="/user/dashboard" replace />;
  // Not logged in — send to login
  return <Navigate to="/" replace />;
}

// ─────────────────────────────────────────────
// AdminRoute: blocks non-admins from admin pages
// ─────────────────────────────────────────────
function AdminRoute({ children }) {
  const role = localStorage.getItem("role");
  if (role !== "admin") return <Navigate to="/user/dashboard" replace />;
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

// ─────────────────────────────────────────────
// UserRoute: blocks non-users from user-only pages
// ─────────────────────────────────────────────
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
      <Routes>

        {/* ========================= */}
        {/* AUTH ROUTES               */}
        {/* ========================= */}

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* After login, redirect to the right dashboard based on role */}
        <Route path="/home" element={<RoleRedirect />} />

        {/* ========================= */}
        {/* ADMIN-ONLY ROUTES         */}
        {/* ========================= */}

        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        <Route path="/investors" element={<AdminRoute><Investors /></AdminRoute>} />
        <Route path="/investments" element={<AdminRoute><Investments /></AdminRoute>} />
        <Route path="/withdrawals" element={<AdminRoute><Withdrawals /></AdminRoute>} />
        <Route path="/bonuses" element={<AdminRoute><Bonuses /></AdminRoute>} />
        <Route path="/blocked" element={<AdminRoute><BlockedAccounts /></AdminRoute>} />

        {/* ========================= */}
        {/* USER-ONLY ROUTES          */}
        {/* ========================= */}

        <Route path="/user/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />
        <Route path="/user/investments" element={<UserRoute><UserInvestments /></UserRoute>} />
        <Route path="/user/withdrawals" element={<UserRoute><UserWithdrawals /></UserRoute>} />

        {/* ========================= */}
        {/* SHARED ROUTES             */}
        {/* (accessible by both roles) */}
        {/* ========================= */}

        <Route path="/fund-account" element={<ProtectedRoute><FundAccount /></ProtectedRoute>} />
        <Route path="/investment-plans" element={<ProtectedRoute><InvestmentPlans /></ProtectedRoute>} />
        <Route path="/copy-trading" element={<ProtectedRoute><CopyTrading /></ProtectedRoute>} />
        <Route path="/ai-trading-bots" element={<ProtectedRoute><AITradingBots /></ProtectedRoute>} />
        <Route path="/purchase-stocks" element={<ProtectedRoute><PurchaseStocks /></ProtectedRoute>} />
        <Route path="/profit-history" element={<ProtectedRoute><ProfitHistory /></ProtectedRoute>} />
        <Route path="/referrals" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* ========================= */}
        {/* FALLBACK                  */}
        {/* ========================= */}

        {/* Any unknown URL → redirect to role's home */}
        <Route path="*" element={<RoleRedirect />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;