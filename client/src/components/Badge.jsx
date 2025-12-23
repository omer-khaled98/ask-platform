export default function Badge({ children, color = 'slate' }) {
return <span className={`inline-block rounded-full px-3 py-1 text-xs bg-${color}-100 text-${color}-700`}>{children}</span>;
}