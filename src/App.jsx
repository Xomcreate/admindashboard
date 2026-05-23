// src/App.jsx

import React, { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

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

// SETTINGS
import Settings from "./pages/Settings";

// ROUTES
import ProtectedRoute from "./routes/ProtectedRoute";

// COMPONENTS
import Loader from "./MainComponets/Loader";

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {

      setLoading(false);

    }, 2000);

    return () => clearTimeout(timer);

  }, []);

  // LOADER

  if (loading) {
    return <Loader />;
  }

  return (

    <BrowserRouter>

      <Routes>

        {/* ========================= */}
        {/* AUTH ROUTES */}
        {/* ========================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ========================= */}
        {/* ADMIN ROUTES */}
        {/* ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/investors"
          element={
            <ProtectedRoute>
              <Investors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/investments"
          element={
            <ProtectedRoute>
              <Investments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/withdrawals"
          element={
            <ProtectedRoute>
              <Withdrawals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bonuses"
          element={
            <ProtectedRoute>
              <Bonuses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blocked"
          element={
            <ProtectedRoute>
              <BlockedAccounts />
            </ProtectedRoute>
          }
        />

        {/* ========================= */}
        {/* USER ROUTES */}
        {/* ========================= */}

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/investments"
          element={
            <ProtectedRoute>
              <UserInvestments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/withdrawals"
          element={
            <ProtectedRoute>
              <UserWithdrawals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ========================= */}
        {/* SETTINGS */}
        {/* ========================= */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  )
}

export default App;