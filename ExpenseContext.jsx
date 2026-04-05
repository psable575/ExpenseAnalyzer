import React, { createContext, useState, useEffect, useContext } from 'react';

const ExpenseContext = createContext();

export const useExpenseData = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  // --- AUTHENTICATION STATE ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('expenseUser');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (name) => {
    const newUser = { name, joined: new Date().toISOString() };
    setUser(newUser);
    localStorage.setItem('expenseUser', JSON.stringify(newUser));
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('expenseUser');
  };

  // --- CATEGORIES ---
  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Refunds', 'Dividends', 'Gifts', 'Other'];
  const expenseCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Subscriptions', 'Rent', 'Shopping', 'Health', 'Other'];

  // --- DATA STATE ---
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('expenseTransactionsV2');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, type: 'expense', amount: 999, category: 'Subscriptions', description: 'Netflix & Spotify', date: new Date().toISOString() },
      { id: 2, type: 'expense', amount: 450, category: 'Food', description: 'Zomato', date: new Date(Date.now() - 86400000).toISOString() },
      { id: 3, type: 'income', amount: 80000, category: 'Salary', description: 'Monthly Salary', date: new Date(Date.now() - 86400000 * 5).toISOString() },
      { id: 4, type: 'expense', amount: 25000, category: 'Rent', description: 'Monthly Rent', date: new Date(Date.now() - 86400000 * 4).toISOString() },
      { id: 5, type: 'expense', amount: 2500, category: 'Entertainment', description: 'Concert Tickets', date: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 6, type: 'income', amount: 15000, category: 'Freelance', description: 'Web Design Project', date: new Date(Date.now() - 86400000 * 10).toISOString() }
    ];
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('expenseBudgetsV2');
    if (saved) return JSON.parse(saved);
    return {
      Food: 8000,
      Transport: 3000,
      Utilities: 4000,
      Entertainment: 5000,
      Subscriptions: 2000,
      Rent: 30000,
      Shopping: 5000,
      Health: 2000,
      Other: 2000
    };
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('expenseGoalsV2');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: 'Emergency Fund', target: 100000, saved: 35000, targetDate: new Date(Date.now() + 86400000 * 90).toISOString() },
      { id: 2, name: 'New Laptop', target: 80000, saved: 10000, targetDate: new Date(Date.now() + 86400000 * 180).toISOString() }
    ];
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('expenseTransactionsV2', JSON.stringify(transactions));
    localStorage.setItem('expenseBudgetsV2', JSON.stringify(budgets));
    localStorage.setItem('expenseGoalsV2', JSON.stringify(goals));
  }, [transactions, budgets, goals]);

  // --- ACTIONS ---
  const addTransaction = (t) => setTransactions([{ ...t, id: Date.now() }, ...transactions]);
  const deleteTransaction = (id) => setTransactions(transactions.filter(t => t.id !== id));
  
  const updateBudget = (category, amount) => setBudgets({ ...budgets, [category]: amount });
  
  const addGoal = (g) => setGoals([...goals, { ...g, id: Date.now(), saved: 0 }]);
  const updateGoalSaved = (id, amountToAdd) => {
    setGoals(goals.map(g => g.id === id ? { ...g, saved: g.saved + amountToAdd } : g));
    addTransaction({
       id: Date.now(),
       type: 'expense',
       amount: amountToAdd,
       category: 'Other',
       description: `Contribution to Goal`,
       date: new Date().toISOString()
    });
  };
  const deleteGoal = (id) => setGoals(goals.filter(g => g.id !== id));

  // --- CALCULATIONS ---
  const calculateTotals = () => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  };

  const getExpensesByCategory = () => {
    const result = {};
    Object.keys(budgets).forEach(k => result[k] = 0);
    transactions.filter(t => t.type === 'expense').forEach(t => {
      result[t.category] = (result[t.category] || 0) + t.amount;
    });
    return result;
  };

  const generateInsights = () => {
    const expensesByCategory = getExpensesByCategory();
    const insights = [];
    
    Object.keys(budgets).forEach(category => {
      const spent = expensesByCategory[category] || 0;
      const budget = budgets[category];
      if (spent > budget) {
         insights.push({
           type: 'warning',
           message: `You've exceeded your ${category} budget by ₹${(spent - budget).toLocaleString('en-IN')}. Try to cut back this week.`
         });
      }
    });

    if (expensesByCategory['Subscriptions'] > budgets['Subscriptions']) {
       insights.push({ type: 'info', message: "High subscription costs detected. Are you using all your streaming services? Consider cancelling one." });
    }
    if (expensesByCategory['Food'] > budgets['Food']) {
       insights.push({ type: 'info', message: "Dining out is taking a toll on your wallet. Cooking at home 2 extra nights a week could save you ₹2,000+!" });
    }

    if (insights.length === 0) {
      insights.push({ type: 'success', message: "Great job! You're within budget for all categories. Keep saving!" });
    }
    return insights;
  };

  const value = {
    user, login, logout,
    incomeCategories, expenseCategories,
    transactions, addTransaction, deleteTransaction,
    budgets, updateBudget,
    goals, addGoal, updateGoalSaved, deleteGoal,
    calculateTotals, getExpensesByCategory, generateInsights
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
