const RAW_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
export const API_BASE_ORIGIN = RAW_BASE.replace(/\/+api\/?$/, ""); // http://localhost:4000

export function fileUrl(relPath) {
  if (!relPath) return "";
  return `${API_BASE_ORIGIN}${relPath}`; // مثال: /uploads/xxx.png → http://localhost:4000/uploads/xxx.png
}

export async function api(path, { method = "GET", data, auth } = {}) {
  const base = RAW_BASE.replace(/\/+$/, "");
  const cleanPath = String(path || "").replace(/^\/+/, "");
  const url = `${base}/${cleanPath}`;

  const isForm = typeof FormData !== "undefined" && data instanceof FormData;

  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? (isForm ? data : JSON.stringify(data)) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    window.location.assign("/admin/login");
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    let msg = "Request failed";
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
      console.log("API error:", j);
    } catch (e) {
      console.log("Unknown error:", e);
    }
    throw new Error(msg);
  }

  return res.json();
}

export default api;