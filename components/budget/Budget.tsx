"use client";
import { TransactionType, useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";
import BudgetInsignts from "./BudgetInsignts";
import BudgetSpendingChart from "./BudgetSpendingChart";
import SummaryCards from "./SummaryCards";
import useFetchTransactions from "@/hooks/useFetchTransactions";

interface Category {
  name: string;
  color: string;
  value: string;
  budget: number; // Monthly budget amount
}

const CATEGORIES: Category[] = [
  { name: "Food & Groceries", color: "#FF6384", value: "food", budget: 1500 },
  { name: "Bills & Utilities", color: "#36A2EB", value: "bills", budget: 300 },
  {
    name: "Transportation",
    color: "#FFCE56",
    value: "transport",
    budget: 2000,
  },
  {
    name: "Entertainment",
    color: "#4BC0C0",
    value: "entertainment",
    budget: 400,
  },
  { name: "Shopping", color: "#9966FF", value: "shopping", budget: 500 },
  { name: "Health", color: "#FF9F40", value: "health", budget: 3000 },
  { name: "Housing", color: "#8AC926", value: "housing", budget: 2000 },
  { name: "Other", color: "#A0A0A0", value: "other", budget: 500 },
];

// Local storage key for budgets
const BUDGET_STORAGE_KEY = "user-budgets";

// Create default budgets object
const createDefaultBudgets = () => {
  return CATEGORIES.reduce((acc, category) => {
    acc[category.value] = category.budget;
    return acc;
  }, {} as Record<string, number>);
};

export default function Budget() {
  const { allTransactions } = useAppContext();
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  // const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [budgets, setBudgets] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return {}; // prevent SSR crash
    try {
      const saved = localStorage.getItem(BUDGET_STORAGE_KEY);
      return saved ? JSON.parse(saved) : createDefaultBudgets();
    } catch {
      return createDefaultBudgets();
    }
  });

  const { fetchAllTransactions } = useFetchTransactions();

  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // const initialLoadDone = useRef(false);

  // Load transactions from context
  useEffect(() => {
    setTransactions(allTransactions);
  }, [allTransactions]);

  // Handle localStorage - only run once on initial mount
  useEffect(() => {
    // Skip on server-side render
    if (typeof window === "undefined") return;

    // Skip if we've already loaded
    // if (initialLoadDone.current) return;
    fetchAllTransactions();
    try {
      console.log("Initial load from localStorage");
      const savedBudgets = localStorage.getItem(BUDGET_STORAGE_KEY);

      if (savedBudgets) {
        console.log("Found saved budgets:", savedBudgets);
        const parsed = JSON.parse(savedBudgets);
        setBudgets(parsed);
      } else {
        console.log("No saved budgets found, using defaults");
        setBudgets(createDefaultBudgets());
      }
    } catch (e) {
      console.error("Error loading from localStorage:", e);
      setBudgets(createDefaultBudgets());
    }

    // initialLoadDone.current = true;
    setIsLoaded(true);
  }, []);

  // Save budgets to localStorage whenever they change
  // But only after initial load is complete

  // useEffect(() => {
  //   if (!isLoaded || typeof window === "undefined") return;

  //   // Don't save if budgets is empty (initial state)
  //   if (Object.keys(budgets).length === 0) return;

  //   try {
  //     console.log("Saving to localStorage:", budgets);
  //     localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets));
  //   } catch (e) {
  //     console.error("Error saving to localStorage:", e);
  //   }
  // }, [budgets, isLoaded]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (Object.keys(budgets).length === 0) return;

    try {
      localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }, [budgets]);

  const formatAmount = (amount: string | number): string => {
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    return numericAmount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  // Calculate total expenses
  const totalExpenses = transactions.reduce(
    (sum, t) => sum + parseFloat(t.amount),
    0
  );

  // Get current month transactions
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  // Calculate category totals for the current month
  const categoryTotals = CATEGORIES.map((category) => {
    const categoryTransactions = currentMonthTransactions.filter(
      (t) => t.category === category.value
    );
    const total = categoryTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0
    );

    // Calculate budget info
    const budget = budgets[category.value] ?? category.budget; // Use nullish coalescing
    const remaining = budget - total;
    const percentUsed = budget > 0 ? (total / budget) * 100 : 0;

    return {
      name: category.name,
      value: category.value,
      total,
      budget,
      remaining,
      percentUsed,
      color: category.color,
      status:
        percentUsed > 100 ? "over" : percentUsed > 85 ? "warning" : "good",
    };
  });

  // Prepare budget vs actual data for chart
  const budgetComparisonData = categoryTotals
    .filter((category) => category.total > 0 || category.budget > 0)
    .map((category) => ({
      name: category.name,
      Actual: category.total,
      Budget: category.budget,
      color: category.color,
    }));

  // Generate insights ========================================================================
  const generateInsights = () => {
    const insights = [];

    // Find the categories that are over budget
    const overBudgetCategories = categoryTotals.filter(
      (cat) => cat.percentUsed > 100
    );
    if (overBudgetCategories.length > 0) {
      insights.push({
        type: "warning",
        message: `You are over budget in ${
          overBudgetCategories.length
        } categories: ${overBudgetCategories.map((c) => c.name).join(", ")}.`,
      });
    }

    // Find categories that are close to the budget limit
    const warningCategories = categoryTotals.filter(
      (cat) => cat.percentUsed > 85 && cat.percentUsed <= 100
    );
    if (warningCategories.length > 0) {
      insights.push({
        type: "alert",
        message: `You're approaching your budget limit in: ${warningCategories
          .map((c) => c.name)
          .join(", ")}.`,
      });
    }

    // Find the top spending category
    if (categoryTotals.some((cat) => cat.total > 0)) {
      const topCategory = [...categoryTotals].sort(
        (a, b) => b.total - a.total
      )[0];
      insights.push({
        type: "info",
        message: `Your highest spending category is ${
          topCategory.name
        } at ${formatAmount(topCategory.total)}.`,
      });
    } else {
      insights.push({
        type: "info",
        message: "You haven't recorded any expenses yet this month.",
      });
    }

    // Calculate total budget and remaining
    const totalBudget = Object.values(budgets).reduce(
      (sum, amount) => sum + amount,
      0
    );

    const totalRemaining =
      totalBudget -
      currentMonthTransactions.reduce(
        (sum, t) => sum + parseFloat(t.amount),
        0
      );

    insights.push({
      type: "info",
      message: `You have ${formatAmount(
        totalRemaining
      )} remaining from your total monthly budget of ${formatAmount(
        totalBudget
      )}.`,
    });

    // Compare with last month (dummy insight since we don't have last month's data)
    insights.push({
      type: "success",
      message: "You spent less on entertainment compared to last month!",
    });

    return insights;
  };

  const insights = generateInsights();

  const handleBudgetChange = (categoryValue: string, newBudget: string) => {
    const numericBudget = parseInt(newBudget);
    if (!isNaN(numericBudget) && numericBudget >= 0) {
      setBudgets((prev) => ({
        ...prev,
        [categoryValue]: numericBudget,
      }));
    }
    setEditingBudget(null);
  };

  // Function to reset all budgets to default values
  const resetBudgetsToDefault = () => {
    setBudgets(createDefaultBudgets());
  };

  // If not yet loaded, render a simple loading state
  if (!isLoaded) {
    return (
      <div className="mt-10">
        <h1 className="text-3xl font-bold mb-8">Budget Dashboard</h1>
        <p>Loading budget data...</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold mb-8">Budget Dashboard</h1>

      <SummaryCards
        totalExpenses={totalExpenses}
        transactions={transactions}
        currentMonthTransactions={currentMonthTransactions}
      />

      <BudgetSpendingChart budgetComparisonData={budgetComparisonData} />

      <BudgetInsignts insights={insights} />

      {/* Budget Management */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Monthly Budget Management</h2>
          <button
            onClick={resetBudgetsToDefault}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Reset to Default
          </button>
        </div>
        <div className="overflow-hidden border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryTotals.map((category) => {
                let statusColor = "bg-green-100 text-green-800";
                if (category.status === "warning") {
                  statusColor = "bg-yellow-100 text-yellow-800";
                } else if (category.status === "over") {
                  statusColor = "bg-red-100 text-red-800";
                }

                return (
                  <tr key={category.value}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                      {editingBudget === category.value ? (
                        <input
                          type="number"
                          className="border rounded w-24 px-2 py-1 text-right"
                          defaultValue={category.budget}
                          autoFocus
                          onBlur={(e) =>
                            handleBudgetChange(category.value, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleBudgetChange(
                                category.value,
                                e.currentTarget.value
                              );
                            }
                          }}
                          min="0"
                        />
                      ) : (
                        formatAmount(category.budget)
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                      {formatAmount(category.total)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                      <span
                        className={category.remaining < 0 ? "text-red-600" : ""}
                      >
                        {formatAmount(category.remaining)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}
                      >
                        {category.percentUsed.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <button
                        onClick={() => setEditingBudget(category.value)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Progress Bars */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryTotals
            .filter((category) => category.total > 0 || category.budget > 0)
            .map((category) => {
              let barColor = "bg-green-500";
              if (category.percentUsed > 100) {
                barColor = "bg-red-500";
              } else if (category.percentUsed > 85) {
                barColor = "bg-yellow-500";
              }

              return (
                <div
                  key={category.value}
                  className="bg-gray-100 p-4 rounded-lg"
                >
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatAmount(category.total)} /{" "}
                      {formatAmount(category.budget)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`${barColor} h-2.5 rounded-full`}
                      style={{
                        width: `${Math.min(category.percentUsed, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
