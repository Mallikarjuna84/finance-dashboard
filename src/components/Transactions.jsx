import { useState } from "react";

export default function Transactions({ transactions }) {
  const [search, setSearch] = useState("");

  const filtered = transactions.filter(t =>
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search category"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 rounded my-2"
      />
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => (
            <tr key={t.id} className="hover:bg-gray-200 dark:hover:bg-gray-700">
              <td>{t.date}</td>
              <td>${t.amount}</td>
              <td>{t.category}</td>
              <td>{t.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
