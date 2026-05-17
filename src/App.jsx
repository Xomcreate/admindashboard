// src/App.jsx

import React, { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Investors from "./pages/Investors";
import Investments from "./pages/Investments";
import Withdrawals from "./pages/Withdrawals";
import Bonuses from "./pages/Bonuses";
import Settings from "./pages/Settings";

import ProtectedRoute from "./routes/ProtectedRoute";

import Loader from "./MainComponets/Loader";
import BlockedAccounts from "./pages/BlockedAccounts";

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {

      setLoading(false);

    }, 2000);

    return () => clearTimeout(timer);

  }, []);

  // SHOW LOADER FIRST

  if (loading) {
    return <Loader />;
  }

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN ROUTE */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* INVESTORS */}

        <Route
          path="/investors"
          element={
            <ProtectedRoute>
              <Investors />
            </ProtectedRoute>
          }
        />

        {/* INVESTMENTS */}

        <Route
          path="/investments"
          element={
            <ProtectedRoute>
              <Investments />
            </ProtectedRoute>
          }
        />

        {/* WITHDRAWALS */}

        <Route
          path="/withdrawals"
          element={
            <ProtectedRoute>
              <Withdrawals />
            </ProtectedRoute>
          }
        />

        {/* BONUSES */}

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
              <BlockedAccounts/>
            </ProtectedRoute>
          }
        />

        {/* SETTINGS */}

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