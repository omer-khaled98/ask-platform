import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function AdminUsers() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ email: "", name: "", password: "", role: "staff" });

  async function load() {
    // Requires server endpoints:
    // GET  /api/auth/users           (admin)
    // POST /api/auth/users           (admin) {email, name?, password, role}
    // PATCH /api/auth/users/:id/toggle (admin)
    const users = await api("auth/users", { auth: true });
    setList(users);
  }
  useEffect(() => { load(); }, []);

  async function createUser(e) {
    e.preventDefault();
    await api("auth/users", { method: "POST", auth: true, data: form });
    setForm({ email: "", name: "", password: "", role: "staff" });
    load();
  }

  async function toggle(id) {
    await api(`auth/users/${id}/toggle`, { method: "PATCH", auth: true });
    load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-right">المستخدمون</h1>

      <form onSubmit={createUser} className="grid md:grid-cols-5 gap-3 bg-white p-4 rounded-xl shadow">
        <input
          dir="rtl" className="border rounded-xl px-3 py-2" placeholder="البريد"
          value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
        />
        <input
          dir="rtl" className="border rounded-xl px-3 py-2" placeholder="الاسم (اختياري)"
          value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
        />
        <input
          dir="rtl" type="password" className="border rounded-xl px-3 py-2" placeholder="كلمة المرور"
          value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
        />
        <select className="border rounded-xl px-3 py-2" value={form.role}
                onChange={e=>setForm({...form,role:e.target.value})}>
          <option value="staff">موظّف</option>
          <option value="admin">أدمن</option>
        </select>
        <button className="bg-emerald-600 text-white rounded-xl">إنشاء</button>
      </form>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2">البريد</th>
              <th className="p-2">الاسم</th>
              <th className="p-2">الدور</th>
              <th className="p-2">الحالة</th>
              <th className="p-2">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {list.map(u=>(
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.name || "-"}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.active ? "مفعل" : "متوقف"}</td>
                <td className="p-2">
                  <button onClick={()=>toggle(u._id)} className="px-3 py-1 rounded bg-slate-800 text-white">تبديل</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">لا يوجد مستخدمون.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
