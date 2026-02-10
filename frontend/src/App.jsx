import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import your premium footer
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TakeMoney from "./pages/TakeMoney";
import GiveMoney from "./pages/GiveMoney";
import GroupExpenses from "./pages/GroupExpenses";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* The wrapper div ensures the footer sticks to the bottom */}
        <div className="flex flex-col min-h-screen bg-[#050505]">
          <Navbar />
          
          {/* Main content area expands to fill space */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              
              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/take"
                element={
                  <ProtectedRoute>
                    <TakeMoney />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/give"
                element={
                  <ProtectedRoute>
                    <GiveMoney />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/groups"
                element={
                  <ProtectedRoute>
                    <GroupExpenses />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* The Premium Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}