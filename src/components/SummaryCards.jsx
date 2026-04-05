export default function SummaryCards({ transactions }) {
  const income = transactions.filter(t => t.type === "income").reduce((a,b)=>a+b.amount,0);
  const expense = transactions.filter(t => t.type === "expense").reduce((a,b)=>a+b.amount,0);
  const balance = income - expense;

  return (
    <div className="grid grid-cols-3 gap-4 my-4">
      <div className="card">Total Balance: ${balance}</div>
      <div className="card">Income: ${income}</div>
      <div className="card">Expenses: ${expense}</div>
    </div>
  );
}
