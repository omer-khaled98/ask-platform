//export default function Table({ columns, rows }) {
//return (
//<div className="overflow-x-auto border rounded-xl bg-white">
//<table className="min-w-full text-sm">
//<thead className="bg-slate-100">
//<tr>
//{columns.map((c) => (
//<th key={c.key} className="text-left p-3 font-semibold">{c.header}</th>
//))}
//</tr>
//</thead>
//<tbody>
//{rows.map((r, i) => (
//<tr key={r._id || i} className="border-t">
//{columns.map((c) => (
//<td key={c.key} className="p-3 align-top">{c.render ? c.render(r) : r[c.key]}</td>
//))}
//</tr>
//))}
//</tbody>
//</table>
//</div>
//);
//}