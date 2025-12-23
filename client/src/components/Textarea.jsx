export default function Textarea({ label, ...props }) {
return (
<label className="block mb-3">
<span className="block mb-1 text-sm text-slate-600">{label}</span>
<textarea className="w-full rounded-xl border px-3 py-2 h-32 resize-y focus:outline-none focus:ring" {...props} />
</label>
);
}