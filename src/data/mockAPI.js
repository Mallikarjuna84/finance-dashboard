export const fetchTransactions = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      const data = [
        { id: 1, date: "2026-04-01", amount: 500, category: "Food", type: "expense" },
        { id: 2, date: "2026-04-02", amount: 2000, category: "Salary", type: "income" },
        { id: 3, date: "2026-04-03", amount: 300, category: "Transport", type: "expense" },
        { id: 4, date: "2026-04-04", amount: 400, category: "Entertainment", type: "expense" },
        { id: 5, date: "2026-04-05", amount: 1500, category: "Freelance", type: "income" },
      ];
      resolve(data);
    }, 500);
  });
