export default function Stats({ data }) {
const map = Object.fromEntries((data.countsByStatus || []).map((d) => [d.status, d.count]));
return (
<div className="grid sm:grid-cols-3 gap-3 mb-4">
{['new','replied','released'].map((k) => (
<div key={k} className="bg-white border rounded-xl p-4">
<div className="text-slate-500 text-sm">{k.toUpperCase()}</div>
<div className="text-2xl font-bold">{map[k] || 0}</div>
</div>
))}
</div>
);
}