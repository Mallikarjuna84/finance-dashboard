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
import { CSVLink } from "react-csv";

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

  // Dark Mode toggle
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // Load transactions
  useEffect(() => {
    fetchTransactions().then((res) => {
      setTransactions(res);
      localStorage.setItem("transactions", JSON.stringify(res));
    });
  }, []);

  // Summary calculations
  const income = transactions.filter((t) => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((a, b) => a + b.amount, 0);
  const balance = income - expense;

  // Filtered transactions
  const filtered = transactions.filter((t) => t.category.toLowerCase().includes(search.toLowerCase()));

  // Line Chart Data
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

  // Pie Chart Data
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

  // JSON download
  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const link = document.createElement("a");
    link.href = dataStr;
    link.download = "transactions.json";
    link.click();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
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

      {/* Export Buttons */}
      <div className="flex gap-4 mb-6">
        <CSVLink
          data={transactions}
          filename={"transactions.csv"}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Export CSV
        </CSVLink>
        <button
          onClick={downloadJSON}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Export JSON
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

      {/* Single Card for Both Charts */}
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

      {/* Transactions Table */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded mb-2 w-full"
        />
        <table className="w-full text-left border-collapse">
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
      </div>
    </div>
  );
}
