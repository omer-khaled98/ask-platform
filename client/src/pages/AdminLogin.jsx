import React, { useState } from "react";
import { api } from "../lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@ask.local");
  const [password, setPassword] = useState("Admin123!");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await api("auth/login", { method: "POST", data: { email, password } });
      localStorage.setItem("token", data.token);
      if (data.role) localStorage.setItem("role", data.role);
      if (data.name) localStorage.setItem("name", data.name);

      // توجيه حسب الدور
      if (data.role === "admin") window.location.assign("/admin");
      else window.location.assign("/staff");
    } catch {
      setErr("بيانات غير صحيحة");
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={submit} className="bg-white w-full max-w-sm p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-right">تسجيل دخول</h1>
        <div className="mt-4 space-y-3">
          <input
            dir="rtl"
            className="w-full border rounded-xl px-3 py-2"
            placeholder="البريد"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            dir="rtl"
            type="password"
            className="w-full border rounded-xl px-3 py-2"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2">
            دخول
          </button>
          {err && <p className="text-right text-red-600">{err}</p>}
        </div>
      </form>
    </div>
  );
}
