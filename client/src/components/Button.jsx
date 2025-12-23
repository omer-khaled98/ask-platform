export default function Button({ children, ...props }) {
return (
<button className="rounded-xl px-4 py-2 border bg-black text-white hover:opacity-90 disabled:opacity-50" {...props}>
{children}
</button>
);
}