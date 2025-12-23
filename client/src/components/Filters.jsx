import React from 'react';
import Input from './Input.jsx';
import Button from './Button.jsx';


export default function Filters({ values, onChange, onApply, onReset }) {
return (
<div className="bg-white border rounded-xl p-3 mb-4 flex flex-wrap gap-3 items-end">
<div>
<label className="block text-sm text-slate-600 mb-1">Status</label>
<select value={values.status} onChange={(e) => onChange({ ...values, status: e.target.value })} className="border rounded-xl px-3 py-2">
<option value="">All</option>
<option value="new">New</option>
<option value="replied">Replied</option>
<option value="released">Released</option>
</select>
</div>
<Input label="Search" value={values.q} onChange={(e) => onChange({ ...values, q: e.target.value })} placeholder="name/phone/email/message" />
<Input label="From" type="date" value={values.from} onChange={(e) => onChange({ ...values, from: e.target.value })} />
<Input label="To" type="date" value={values.to} onChange={(e) => onChange({ ...values, to: e.target.value })} />
<Button onClick={onApply}>Apply</Button>
<button className="px-4 py-2" onClick={onReset}>Reset</button>
</div>
);
}
