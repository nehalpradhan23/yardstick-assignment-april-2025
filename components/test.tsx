import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

const Test = () => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    date: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  // Load demo data
  useEffect(() => {
    const demoData: any = [
      { id: 1, amount: 55.99, date: "2025-04-01", description: "Groceries" },
      {
        id: 2,
        amount: 120.5,
        date: "2025-04-02",
        description: "Electricity bill",
      },
      { id: 3, amount: 35.0, date: "2025-04-05", description: "Dinner" },
      { id: 4, amount: 200.0, date: "2025-04-10", description: "New clothes" },
      { id: 5, amount: 45.75, date: "2025-04-12", description: "Gasoline" },
    ];
    setTransactions(demoData);
  }, []);

  const validateTransaction = (transaction: any) => {
    const newErrors = {};
    if (!transaction.amount || isNaN(parseFloat(transaction.amount))) {
      newErrors.amount = "Amount is required and must be a number";
    }
    if (!transaction.date) {
      newErrors.date = "Date is required";
    }
    if (!transaction.description) {
      newErrors.description = "Description is required";
    }
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value,
    });
  };

  const handleAddTransaction = () => {
    const validationErrors = validateTransaction(newTransaction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newId =
      transactions.length > 0
        ? Math.max(...transactions.map((t) => t.id)) + 1
        : 1;
    setTransactions([
      ...transactions,
      {
        id: newId,
        amount: parseFloat(newTransaction.amount),
        date: newTransaction.date,
        description: newTransaction.description,
      },
    ]);
    setNewTransaction({ amount: "", date: "", description: "" });
    setErrors({});
  };

  const startEditing = (transaction) => {
    setEditingId(transaction.id);
    setNewTransaction({
      amount: transaction.amount.toString(),
      date: transaction.date,
      description: transaction.description,
    });
  };

  const handleUpdateTransaction = () => {
    const validationErrors = validateTransaction(newTransaction);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setTransactions(
      transactions.map((t) =>
        t.id === editingId
          ? {
              ...t,
              amount: parseFloat(newTransaction.amount),
              date: newTransaction.date,
              description: newTransaction.description,
            }
          : t
      )
    );
    setEditingId(null);
    setNewTransaction({ amount: "", date: "", description: "" });
    setErrors({});
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNewTransaction({ amount: "", date: "", description: "" });
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewTransaction({ amount: "", date: "", description: "" });
    setErrors({});
  };

  // Prepare data for monthly expenses chart
  const getMonthlyData = () => {
    const monthData = {};

    transactions.forEach((transaction) => {
      const month = transaction.date.substring(0, 7); // Format: YYYY-MM
      if (!monthData[month]) {
        monthData[month] = 0;
      }
      monthData[month] += transaction.amount;
    });

    return Object.keys(monthData)
      .map((month) => ({
        month: month,
        expenses: monthData[month],
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Personal Finance Tracker
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
            <CardDescription>Enter your transaction details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={newTransaction.amount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={newTransaction.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={newTransaction.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="What was this expense for?"
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {editingId ? (
              <>
                <button
                  onClick={handleUpdateTransaction}
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  <Save size={18} className="mr-1" /> Update
                </button>
                <button
                  onClick={cancelEditing}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAddTransaction}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <Plus size={18} className="mr-1" /> Add Transaction
              </button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>View your spending patterns</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getMonthlyData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="expenses" fill="#8884d8" name="Expenses ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and manage your transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center py-4 text-gray-500">
              No transactions yet. Add one to get started!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2 border-b">Date</th>
                    <th className="text-left p-2 border-b">Description</th>
                    <th className="text-right p-2 border-b">Amount</th>
                    <th className="text-right p-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="p-2 border-b">{transaction.date}</td>
                        <td className="p-2 border-b">
                          {transaction.description}
                        </td>
                        <td className="p-2 border-b text-right">
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="p-2 border-b text-right">
                          <button
                            onClick={() => startEditing(transaction)}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteTransaction(transaction.id)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Test;
