import React from "react";
import { Outlet, Link, Navigate, useLocation } from "react-router-dom";

// حماية الراوتات
function ProtectedRoute({ allowed, children }) {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/admin/login" />;

  if (allowed && !allowed.includes(role)) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

export default function App() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  // ============================
  // ❌ إخفاء الهيدر في:
  // - صفحة AskForm الرئيسية "/"
  // - صفحة لوجين الأدمن
  // ============================
  const hideHeader =
    location.pathname === "/" ||
    location.pathname.startsWith("/admin/login");

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ============================
          🔥 الهيدر — يظهر فقط لصفحات الأدمن
      ============================ */}
      {!hideHeader && (
        <header className="bg-white border-b shadow-sm">
          <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">

            <Link to="/" className="font-bold text-xl text-emerald-700">
              منصّة الاستفسارات
            </Link>

            <nav className="flex gap-4 text-sm">
              <Link to="/" className="text-gray-700 hover:text-emerald-700">
                الصفحة الرئيسية
              </Link>

              {role === "staff" && (
                <Link
                  to="/staff"
                  className="text-gray-700 hover:text-emerald-700"
                >
                  لوحة الموظّف
                </Link>
              )}

              {role === "admin" && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-emerald-700"
                >
                  لوحة التحكّم
                </Link>
              )}
            </nav>

          </div>
        </header>
      )}

      {/* ============================
          🔥 المحتوى 
          AskForm يأخذ الشاشة كاملة بدون max-width
      ============================ */}
      <main
        className={
          hideHeader
            ? "p-0"                      // AskForm full-width
            : "max-w-6xl mx-auto p-4"   // صفحات الأدمن
        }
      >
        <Outlet />
      </main>
    </div>
  );
}
