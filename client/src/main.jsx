import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";                 // layout العام
import AskForm from "./pages/AskForm.jsx";   // صفحة العميل العامة

import AdminLogin from "./pages/AdminLogin.jsx";
import AppLayout from "./layout/AppLayout.jsx"; // لوحة الإدارة الجديدة

// التابات
import DashboardTab from "./tabs/DashboardTab.jsx";
import UsersTab from "./tabs/UsersTab.jsx";
import InquiriesTab from "./tabs/InquiriesTab.jsx";
import ActivityTab from "./tabs/ActivityTab.jsx";

import StaffInbox from "./pages/StaffInbox.jsx";

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/admin/login" replace />;
}

function RequireRole({ allowed, children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/admin/login" replace />;

  if (allowed && !allowed.includes(role)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        {/* ======== FRONT PUBLIC ======== */}
        <Route element={<App />}>
          <Route path="/" element={<AskForm />} />

          {/* ======== LOGIN ======== */}
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        {/* ======== STAFF DASHBOARD ======== */}
        <Route
          path="/staff"
          element={
            <RequireRole allowed={["staff", "admin"]}>
              <StaffInbox />
            </RequireRole>
          }
        />

        {/* ======== ADMIN PANEL (AppLayout) ======== */}
        <Route
          path="/admin"
          element={
            <RequireRole allowed={["admin"]}>
              <AppLayout />
            </RequireRole>
          }
        >
          {/* التابات */}
          <Route index element={<DashboardTab />} />
          <Route path="users" element={<UsersTab />} />
          <Route path="inquiries" element={<InquiriesTab />} />
          <Route path="activity" element={<ActivityTab />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
