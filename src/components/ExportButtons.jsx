export default function ExportButtons({ data }) {
  const exportCSV = () => {
    const rows = data.map(t => [t.date, t.amount, t.category, t.type].join(","));
    const csv = "Date,Amount,Category,Type\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transactions.csv";
    link.click();
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transactions.json";
    link.click();
  };

  return (
    <div className="flex gap-2 mt-4">
      <button onClick={exportCSV} className="px-4 py-2 bg-green-500 text-white rounded-lg">Export CSV</button>
      <button onClick={exportJSON} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Export JSON</button>
    </div>
  );
}
