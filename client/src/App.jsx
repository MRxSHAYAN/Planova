import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./web/Home"


export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Web Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          {/* Auth Routes */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
        </Route>

        {/* Dashboard Pages — Protected */}
        <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="notifications" element={<ViewAllNotifications />} />
          <Route path="profile" element={<PublicProfile />} />
          <Route path="profile-settings" element={<ProfileSettings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="new-swap" element={<NewSwap />} />
          <Route path="explore" element={<DashboardExploreSkills />} />
          <Route path="explore-skills" element={<DashboardExploreSkills />} />
          <Route path="room" element={<LiveRoom />} />
          <Route path="swaps" element={<MySwaps />} />
          <Route path="my-swaps" element={<MySwaps />} />
          <Route path="sessions" element={<MySwaps />} />
          <Route path="matches" element={<Matches />} />
          <Route path="messages" element={<Messages />} />
          <Route path="credits" element={<Credits />} />
          <Route path="leaderboard" element={<SSPleaderboard />} />
          <Route path="swap-details/:id" element={<SwapDetails />} />
          <Route path="swap-details" element={<SwapDetails />} />
        </Route>
        </Route>
      </Routes>
    </>
  );
}