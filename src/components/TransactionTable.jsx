import { useState } from "react";

export default function TransactionTable({ data }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("none");

  const filteredData = data.filter((t) => {
    return (
      (filter === "all" || t.type === filter) &&
      t.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sort === "amount") return b.amount - a.amount;
    if (sort === "date") return new Date(b.date) - new Date(a.date);
    return 0;
  });

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-3">
        <input
          type="text"
          placeholder="Search category..."
          className="border px-3 py-2 rounded-lg"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-lg"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="border px-3 py-2 rounded-lg"
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="none">Sort</option>
          <option value="amount">Amount</option>
          <option value="date">Date</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full border rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Type</th>
          </tr>
        </thead>

        <tbody>
          {sortedData.map((t) => (
            <tr key={t.id} className="text-center border-t hover:bg-gray-50">
              <td>{t.date}</td>
              <td>₹{t.amount}</td>
              <td>{t.category}</td>
              <td>{t.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
