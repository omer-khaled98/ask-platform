import React, { useState, useMemo } from "react";
import { api } from "../lib/api";
import { motion } from "framer-motion";
import { Phone, Send, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function AskForm() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);  // رفع الملف الصوتي
  const [ok, setOk] = useState(null);
  const [loading, setLoading] = useState(false);

  const phoneValid = useMemo(() => {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 14;
  }, [phone]);

  const msgCount = message.length;
  const msgOk = msgCount >= 4 && msgCount <= 1000;
async function submit(e) {
  e.preventDefault();
  
  // تحقق من أن البيانات صحيحة قبل الإرسال
  if (!phoneValid || !msgOk) return;

  setLoading(true);
  setOk(null);

  // تأكد من أن الحقول المطلوبة موجودة
  if (!phone || !message) {
    setOk(false);
    setLoading(false);
    return;  // لا ترسل الطلب إذا كانت الحقول فارغة
  }

  // إرسال البيانات بتنسيق JSON
  const data = {
    phone: phone,
    message: message,
  };

  if (file) {
    // إذا كان هناك ملف صوتي، سيتم إضافته (وإرساله كـ FormData إذا لزم الأمر)
    data.file = file;
  }

  try {
    // إرسال الطلب إلى الخادم بتنسيق JSON
    const response = await api("inquiries", { method: "POST", data: data });

    // إذا تم الإرسال بنجاح
    setOk(true);
    setPhone("");  // إعادة تعيين رقم الهاتف
    setMessage("");  // إعادة تعيين الرسالة
    setFile(null);  // إعادة تعيين الملف الصوتي
  } catch (error) {
    // في حال حدوث خطأ في الطلب
    setOk(false);
    console.error("Error submitting form:", error);
  } finally {
    setLoading(false);  // إيقاف حالة التحميل
  }
}



  return (
    <div
      dir="rtl"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50 via-sky-50 to-white"
    >
      {/* خلفية زخرفية ناعمة */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-28 -left-28 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl"
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl"
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-24 right-1/3 h-44 w-44 rounded-full bg-teal-100/50 blur-2xl"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative w-full max-w-lg p-4">
        {/* شارة بسيطة */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          className="mb-3 flex justify-end"
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles size={14} /> إصدار تجريبي
          </span>
        </motion.div>

        {/* البطاقة الرئيسية */}
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-xl backdrop-blur-xl"
        >
          {/* توهج خفيف عند الهوفر */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-emerald-600/0 transition group-hover:ring-emerald-600/20" />

          {/* الهيدر */}
          <div className="relative border-b border-slate-100/70 px-6 py-5">
            <div className="absolute -left-6 -top-10 h-28 w-28 rounded-full bg-emerald-100/60 blur-2xl" />
            <h1 className="flex items-center justify-end gap-2 text-2xl font-extrabold text-slate-800">
              تواصل معنا <ShieldCheck size={20} className="text-emerald-600" />
            </h1>
            <p className="mt-1 text-right text-sm text-slate-500">
              فقط رقم الجوال ونص الاستفسار — وهنرجعلك بسرعة.
            </p>
          </div>

          {/* الفورم */}
          <form onSubmit={submit} className="px-6 py-5 space-y-4">
            {/* رقم الجوال */}
            <label className="block">
              <span className="mb-1 flex items-center justify-end gap-2 text-sm font-medium text-slate-800">
                رقم الجوال <Phone size={18} className="text-emerald-600" />
              </span>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  dir="rtl"
                  inputMode="tel"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="مثال: 0501234567"
                  className={[ "peer mt-1 w-full rounded-2xl border bg-white/70 px-4 py-3 outline-none backdrop-blur",
                               "transition focus:ring-2",
                               phone.length ? phoneValid ? "border-emerald-300 focus:ring-emerald-400" : "border-rose-300 focus:ring-rose-400" : "border-slate-200 focus:ring-emerald-300"
                              ].join(" ")}
                />
                {/* لمبة حالة */}
                {phone.length > 0 && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={[ "absolute left-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full",
                                 phoneValid ? "bg-emerald-500" : "bg-rose-500" ].join(" ")}
                  />
                )}
              </div>
              {!phoneValid && phone.length > 0 && (
                <p className="mt-1 text-xs text-rose-600">
                  من فضلك أدخل رقم صحيح (10–14 رقم).
                </p>
              )}
            </label>

            {/* نص الاستفسار */}
            <label className="block">
              <span className="mb-1 flex items-center justify-end gap-2 text-sm font-medium text-slate-800">
                نص الاستفسار
              </span>
              <div className="relative">
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  dir="rtl"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب سؤالك هنا..."
                  className={[ "mt-1 w-full rounded-2xl border bg-white/70 px-4 py-3 outline-none backdrop-blur",
                               "transition focus:ring-2",
                               msgOk || message.length === 0
                                 ? "border-slate-200 focus:ring-emerald-300"
                                 : "border-rose-300 focus:ring-rose-400",
                              ].join(" ")}
                />
                <span className="pointer-events-none absolute bottom-2 left-3 text-xs text-slate-400">
                  {msgCount}/1000
                </span>
              </div>
              {!msgOk && message.length > 0 && (
                <p className="mt-1 text-xs text-rose-600">
                  من فضلك اكتب 4 أحرف على الأقل (حتى 1000 حرف).
                </p>
              )}
            </label>

            {/* رفع الملف الصوتي */}
            {/*<label className="block">
              <span className="mb-1 flex items-center justify-end gap-2 text-sm font-medium text-slate-800">
                رفع التسجيل الصوتي
              </span>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={loading}
                className="w-full rounded-2xl border bg-white/70 px-4 py-3 outline-none backdrop-blur"
              />
              {file && <div className="text-xs text-gray-600">📎 {file.name}</div>}
            </label>*/}

            {/* زر الإرسال */}
            <motion.button
              type="submit"
              disabled={loading || !phoneValid || !msgOk}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className={[
                "group relative w-full overflow-hidden rounded-2xl px-4 py-3 text-white",
                "bg-gradient-to-r from-emerald-600 to-teal-600",
                "shadow-lg transition",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              {/* لمعة عرضية ناعمة */}
              <motion.span
                initial={{ x: "-120%" }}
                animate={{ x: ["-120%", "120%"] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm"
              />
              <span className="relative z-10 flex items-center justify-center gap-2 font-semibold tracking-wide">
                {loading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3.5-3.5A9 9 0 103 12h1z"
                      />
                    </svg>
                    جاري الإرسال…
                  </>
                ) : (
                  <>
                    <Send size={18} className="translate-y-[1px]" />
                    إرسال الاستفسار
                  </>
                )}
              </span>
            </motion.button>

            {/* رسائل الحالة */}
            {ok === true && (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="show"
                className="mt-2 flex items-center justify-end gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800"
              >
                <CheckCircle2 className="text-emerald-600" size={18} />
                <span>تم استلام رسالتك، هنكلمك قريبًا.</span>
              </motion.div>
            )}
            {ok === false && (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="show"
                className="mt-2 flex items-center justify-end gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700"
              >
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span>حدث خطأ، حاول مرة أخرى.</span>
              </motion.div>
            )}
          </form>

          {/* فوتر بسيط ومفيد */}
          <div className="flex items-center justify-between px-6 pb-5 pt-3 text-xs text-slate-400">
            <span>⚡️ سريع وبسيط</span>
            <span>لا نطلب الاسم أو البريد</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
