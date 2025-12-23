export default function Input({ label, ...props }) {
return (
<label className="block mb-3">
<span className="block mb-1 text-sm text-slate-600">{label}</span>
<input className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring" {...props} />
</label>
);
}
