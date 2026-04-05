export default function SummaryCard({ title, amount }) {
  return (
    <div className="p-4 rounded-2xl shadow bg-[var(--bg)] border border-[var(--border)]">
      <h2 className="text-sm text-[var(--text)]">{title}</h2>
      <p className="text-2xl font-bold text-[var(--text-h)] mt-2">
        ₹{amount}
      </p>
    </div>
  );
}
