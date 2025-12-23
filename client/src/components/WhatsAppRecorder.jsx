import React, { useState, useRef } from "react";
import { Mic, Square, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppRecorder({ onRecorded }) {
  const [recording, setRecording] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [timer, setTimer] = useState(0);

  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // بدء التسجيل
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) =>
        chunksRef.current.push(e.data);

      mediaRecorderRef.current.onstop = () => {
        if (!cancel) {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          onRecorded(blob);
        }
        stopStream();
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setCancel(false);
      startTimer();
    } catch (err) {
      console.error("Mic not allowed:", err);
    }
  }

  // إيقاف التسجيل
  function stopRecording() {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    resetTimer();
    setRecording(false);
  }

  // إلغاء التسجيل
  function cancelRecording() {
    setCancel(true);
    stopRecording();
  }

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  }

  // المؤقت
  function startTimer() {
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timerRef.current);
    setTimer(0);
  }

  return (
    <div className="mt-3">
      <div className="text-sm text-slate-700 mb-1 text-right">تسجيل صوتي</div>

      {/* زر التسجيل */}
      {!recording && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onPointerDown={startRecording}
          onPointerUp={stopRecording}
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 bg-emerald-600 text-white font-semibold"
        >
          <Mic size={18} />
          اضغط مع الاستمرار للتسجيل
        </motion.button>
      )}

      {/* شاشة التسجيل */}
      {recording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex items-center justify-between bg-rose-50 border border-rose-200 rounded-2xl py-3 px-4"
        >
          <div className="flex items-center gap-2 text-rose-600 font-bold">
            <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
            جاري التسجيل…
          </div>

          <div className="text-slate-700">{timer}s</div>

          <div className="flex gap-3">
            <button
              onClick={cancelRecording}
              className="text-rose-600 hover:text-rose-800"
            >
              <Trash2 size={20} />
            </button>

            <button
              onClick={stopRecording}
              className="text-emerald-600 hover:text-emerald-800"
            >
              <Square size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
