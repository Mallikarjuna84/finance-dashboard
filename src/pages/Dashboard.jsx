import { useState, useEffect } from "react";
import SummaryCard from "../components/SummaryCard";
import TransactionTable from "../components/TransactionTable";
import RoleSwitcher from "../components/RoleSwitcher";
import { LineChartComp, PieChartComp } from "../components/Charts";
import { transactions } from "../data/mockData";

export default function Dashboard() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : transactions;
  });

  const [role, setRole] = useState("viewer");

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(data));
  }, [data]);

  const income = data.filter(t => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = data.filter(t => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const getTopCategory = () => {
    const map = {};
    data.forEach((t) => {
      if (t.type === "expense") {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    });
    return Object.keys(map).reduce((a, b) =>
      map[a] > map[b] ? a : b, "None"
    );
  };

  const addTransaction = () => {
    const newT = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      amount: Math.floor(Math.random() * 1000),
      category: "Other",
      type: Math.random() > 0.5 ? "income" : "expense",
    };
    setData([...data, newT]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

      {/* Header */}
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold">💰 Finance Dashboard</h1>
        <RoleSwitcher role={role} setRole={setRole} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 max-w-6xl mx-auto">
        <SummaryCard title="Balance" amount={income - expense} />
        <SummaryCard title="Income" amount={income} />
        <SummaryCard title="Expenses" amount={expense} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-6xl mx-auto">
        <div className="bg-white p-4 rounded-2xl shadow">
          <LineChartComp data={data} />
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <PieChartComp data={data} />
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 max-w-6xl mx-auto">
        <div className="p-4 bg-white rounded-2xl shadow">
          <h2>Top Category</h2>
          <p className="font-bold mt-2">{getTopCategory()}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow">
          <h2>Total Transactions</h2>
          <p className="font-bold mt-2">{data.length}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow">
          <h2>Expense %</h2>
          <p className="font-bold mt-2">
            {((expense / (income + expense)) * 100 || 0).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Transactions */}
      <div className="mt-6 max-w-6xl mx-auto bg-white p-4 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">Transactions</h2>
        <TransactionTable data={data} />
      </div>

      {/* Admin Button */}
      {role === "admin" && (
        <div className="text-center mt-6">
          <button
            onClick={addTransaction}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl shadow"
          >
            ➕ Add Transaction
          </button>
        </div>
      )}
    </div>
  );
}
