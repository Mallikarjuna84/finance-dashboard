import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

// Mock API
const fetchTransactions = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, date: "2026-04-01", amount: 500, category: "Food", type: "expense" },
        { id: 2, date: "2026-04-02", amount: 2000, category: "Salary", type: "income" },
        { id: 3, date: "2026-04-03", amount: 300, category: "Transport", type: "expense" },
        { id: 4, date: "2026-04-04", amount: 400, category: "Entertainment", type: "expense" },
        { id: 5, date: "2026-04-05", amount: 1500, category: "Freelance", type: "income" },
      ]);
    }, 500);
  });

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    fetchTransactions().then((res) => {
      setTransactions(res);
      localStorage.setItem("transactions", JSON.stringify(res));
    });
  }, []);

  const income = transactions.filter((t) => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  const balance = income - expense;

  const filtered = transactions
    .filter((t) => t.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      } else if (sortBy === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });

  const dates = [...new Set(transactions.map((t) => t.date))].sort();
  const balanceTrend = dates.map((date) => {
    const incomes = transactions.filter((t) => t.type === "income" && t.date <= date).reduce((a, b) => a + b.amount, 0);
    const expenses = transactions.filter((t) => t.type === "expense" && t.date <= date).reduce((a, b) => a + b.amount, 0);
    return incomes - expenses;
  });

  const lineData = {
    labels: dates,
    datasets: [
      {
        label: "Balance Trend",
        data: balanceTrend,
        borderColor: "#aa3bff",
        backgroundColor: "rgba(170,59,255,0.2)",
        tension: 0.4,
      },
    ],
  };

  const categories = [...new Set(transactions.filter((t) => t.type === "expense").map((t) => t.category))];
  const pieData = {
    labels: categories,
    datasets: [
      {
        label: "Spending",
        data: categories.map((cat) =>
          transactions.filter((t) => t.type === "expense" && t.category === cat).reduce((a, b) => a + b.amount, 0)
        ),
        backgroundColor: ["#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa"],
      },
    ],
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(filtered, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.json";
    a.click();
  };

  const exportCSV = () => {
    const header = ["id", "date", "amount", "category", "type"];
    const rows = filtered.map((t) => [t.id, t.date, t.amount, t.category, t.type]);
    const csvContent = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Finance Dashboard</h1>
        <button
          onClick={() => setDark(!dark)}
          className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition hover:scale-105"
        >
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow hover:scale-105 transition-transform">
          <h2 className="text-gray-500 dark:text-gray-300">Total Balance</h2>
          <p className="text-2xl font-bold">${balance}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow hover:scale-105 transition-transform">
          <h2 className="text-gray-500 dark:text-gray-300">Income</h2>
          <p className="text-2xl font-bold">${income}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow hover:scale-105 transition-transform">
          <h2 className="text-gray-500 dark:text-gray-300">Expenses</h2>
          <p className="text-2xl font-bold">${expense}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow hover:scale-105 transition-transform mb-6">
        <h2 className="text-gray-500 dark:text-gray-300 mb-4 text-center text-lg font-semibold">Financial Insights</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 h-64">
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="flex-1 h-64">
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Filter, Search, Table, Export */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <input
            type="text"
            placeholder="Search category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-60"
          />

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border p-2 rounded bg-purple-100 dark:bg-purple-700"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border p-2 rounded bg-blue-100 dark:bg-blue-700"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <table className="w-full text-left border-collapse mb-3">
          <thead>
            <tr className="border-b">
              <th className="py-2">Date</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <td className="py-1">{t.date}</td>
                <td>${t.amount}</td>
                <td>{t.category}</td>
                <td>{t.type}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          >
            Export CSV
          </button>
          <button
            onClick={exportJSON}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
}
