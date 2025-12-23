import { api } from "../lib/api";
import React, { useEffect, useState } from "react";

function fmtStatus(s) {
  if (s === "new") return "جديدة";
  if (s === "replied") return "تم الرد";
  if (s === "released") return "مُفرج عنها";
  return s || "-";
}

export default function StaffInbox() {
  const [items, setItems] = useState([]);
  const [pager, setPager] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ status: "", q: "", from: "", to: "" });

  async function load(page = 1) {
    const params = new URLSearchParams({ ...filters, page });
    const data = await api(`inquiries?${params.toString()}`, { auth: true });
    setItems(data.items || []);
    setPager({ page: data.page, pages: data.pages, total: data.total });
  }

  useEffect(() => {
    load();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    window.location.assign("/admin/login");
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-right">📥 الوارد (الموظّف)</h1>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50"
        >
          تسجيل الخروج
        </button>
      </div>

      {/* فلاتر */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid md:grid-cols-5 gap-3">
          <input
            dir="rtl"
            className="border rounded-xl px-3 py-2"
            placeholder="بحث بالهاتف/النص"
            value={filters.q}
            onChange={(e) =>
              setFilters((f) => ({ ...f, q: e.target.value }))
            }
          />

          <select
            dir="rtl"
            className="border rounded-xl px-3 py-2"
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
          >
            <option value="">كل الحالات</option>
            <option value="new">جديدة</option>
            <option value="replied">تم الرد</option>
            <option value="released">مُفرج عنها</option>
          </select>

          <input
            type="date"
            className="border rounded-xl px-3 py-2"
            value={filters.from}
            onChange={(e) =>
              setFilters((f) => ({ ...f, from: e.target.value }))
            }
          />

          <input
            type="date"
            className="border rounded-xl px-3 py-2"
            value={filters.to}
            onChange={(e) =>
              setFilters((f) => ({ ...f, to: e.target.value }))
            }
          />

          <div className="flex gap-2">
            <button
              onClick={() => load(1)}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white"
            >
              تطبيق
            </button>
            <button
              onClick={() => {
                setFilters({ status: "", q: "", from: "", to: "" });
                load(1);
              }}
              className="px-4 py-2 rounded-xl border"
            >
              تصفير
            </button>
          </div>
        </div>
      </div>

      {/* جدول */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2">التاريخ</th>
              <th className="p-2">الهاتف</th>
              <th className="p-2">الاستفسار</th>
              <th className="p-2">الحالة</th>
              <th className="p-2">الرد / الإثبات</th>
              <th className="p-2">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <Row key={r._id} row={r} onDone={() => load(pager.page)} />
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  لا توجد رسائل.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ترقيم */}
      <div className="flex gap-2 items-center">
        <button
          disabled={pager.page <= 1}
          onClick={() => load(pager.page - 1)}
          className="px-3 py-2 rounded-xl border disabled:opacity-50"
        >
          السابق
        </button>

        <div className="px-3 py-2">
          صفحة {pager.page} / {pager.pages} (إجمالي: {pager.total})
        </div>

        <button
          disabled={pager.page >= pager.pages}
          onClick={() => load(pager.page + 1)}
          className="px-3 py-2 rounded-xl border disabled:opacity-50"
        >
          التالي
        </button>
      </div>
    </div>
  );
}

function Row({ row, onDone }) {
  const [file, setFile] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const isReleased = row.status === "released";

  async function submitReply() {
    if (!file || !replyText.trim()) {
      alert("لازم تكتب الرد وترفع صورة الإثبات");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("screenshot", file);
      fd.append("replyText", replyText);

      await api(`inquiries/${row._id}/reply`, {
        method: "PATCH",
        data: fd,
        auth: true,
      });

      setFile(null);
      setReplyText("");
      onDone();
    } catch (err) {
      console.error(err);
      alert("حصل خطأ أثناء الإرسال");
    } finally {
      setLoading(false);
    }
  }

  return (
    <tr className="border-t align-top">
      <td className="p-2">
        {new Date(row.createdAt).toLocaleString("ar-EG")}
      </td>
      <td className="p-2">{row.phone}</td>
      <td className="p-2 max-w-[40ch]">{row.message}</td>
      <td className="p-2">{fmtStatus(row.status)}</td>

      <td className="p-2">
        {row.replyScreenshotUrl ? (
          <span className="text-emerald-600 font-semibold">
            ✔️ تم الرد ورفع الإثبات
          </span>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={loading || isReleased}
            />

            {file && (
              <div className="text-xs text-gray-600">📎 {file.name}</div>
            )}

            <textarea
              className="border rounded-xl w-full p-2 text-sm"
              placeholder="اكتب نص الرد…"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={loading || isReleased}
            />

            <button
              onClick={submitReply}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "جاري الإرسال..." : "إرسال الرد"}
            </button>
          </div>
        )}
      </td>

      <td className="p-2 text-center text-slate-400">—</td>
    </tr>
  );
}
