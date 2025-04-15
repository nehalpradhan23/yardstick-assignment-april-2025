"use client";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { CATEGORIES } from "../transactions/TransactionTracking";
import { TransactionType, useAppContext } from "@/context/AppContext";

// Define TypeScript interfaces
interface Transaction {
  _id: string;
  amount: string;
  date: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Category {
  name: string;
  color: string;
  value: string;
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
  description?: string;
  date?: string;
  id?: string;
}

const DISTINCT_COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#8AC926",
  "#FF5733",
  "#33FF57",
  "#5733FF",
  "#FF33A8",
  "#33A8FF",
  "#A8FF33",
  "#F08080",
  "#20B2AA",
  "#DDA0DD",
  "#6495ED",
  "#FFA07A",
  "#7FFFD4",
  "#BA55D3",
  "#FFC0CB",
  "#00FFFF",
  "#FFD700",
  "#ADFF2F",
  "#FF00FF",
  "#1E90FF",
  "#DB7093",
  "#32CD32",
  "#FF4500",
  "#8A2BE2",
  "#00FF7F",
  "#B22222",
  "#4682B4",
  "#FF8C00",
  "#008080",
  "#FF1493",
  "#BDB76B",
  "#E0FFFF",
  "#FF7F50",
];

export default function CategoriesDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { allTransactions } = useAppContext();

  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  useEffect(() => {
    setTransactions(allTransactions);
  }, [allTransactions]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount: string): string => {
    return parseFloat(amount).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  // Calculate total expenses
  const totalExpenses = transactions.reduce(
    (sum, t) => sum + parseFloat(t.amount),
    0
  );

  // Get recent transactions (5 most recent by date)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate category totals for the pie chart
  const categoryTotals: PieChartData[] = CATEGORIES.map((category) => {
    const categoryTransactions = transactions.filter(
      (t) => t.category === category.value
    );
    const total = categoryTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0
    );
    return {
      name: category.name,
      value: total,
      color: category.color,
      categoryId: category.value,
    };
  }).filter((item) => item.value > 0); // Only include categories with transactions

  // Filter transactions by the selected category
  const filteredTransactions = selectedCategory
    ? transactions.filter((t) => t.category === selectedCategory)
    : [];

  // Prepare transaction pie chart data for selected category
  const transactionPieData: PieChartData[] = filteredTransactions.map(
    (transaction, index) => {
      // Assign a distinct color from the array, cycling through if there are more transactions than colors
      const colorIndex = index % DISTINCT_COLORS.length;
      const transactionColor = DISTINCT_COLORS[colorIndex];

      return {
        name: transaction.description,
        value: parseFloat(transaction.amount),
        color: transactionColor,
        description: transaction.description,
        date: formatDate(transaction.date),
        id: transaction._id,
      };
    }
  );

  // Custom label for transaction pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }: any) => {
    // Only show label for segments that are large enough
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 0.8;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Categories Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm uppercase mb-2">
            Total Expenses
          </h2>
          <p className="text-3xl font-bold">
            {formatAmount(totalExpenses.toString())}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm uppercase mb-2">
            Number of Transactions
          </h2>
          <p className="text-3xl font-bold">{transactions.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm uppercase mb-2">Top Category</h2>
          {categoryTotals.length > 0 && (
            <div className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{
                  backgroundColor: categoryTotals.sort(
                    (a, b) => b.value - a.value
                  )[0].color,
                }}
              />
              <p className="text-xl font-semibold">
                {categoryTotals.sort((a, b) => b.value - a.value)[0].name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Expenses by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryTotals}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  onClick={(data) => {
                    setSelectedCategory(data.categoryId);
                  }}
                  className="cursor-pointer"
                >
                  {categoryTotals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatAmount(value.toString())}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => {
                  const category = CATEGORIES.find(
                    (c) => c.value === transaction.category
                  );
                  return (
                    <tr key={transaction._id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{
                              backgroundColor: category?.color || "#A0A0A0",
                            }}
                          />
                          {category?.name || "Other"}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                        {formatAmount(transaction.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Category Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {CATEGORIES.filter((cat) =>
            transactions.some((t) => t.category === cat.value)
          ).map((category) => {
            const categoryTotal = transactions
              .filter((t) => t.category === category.value)
              .reduce((sum, t) => sum + parseFloat(t.amount), 0);

            const percentage = (categoryTotal / totalExpenses) * 100;

            return (
              <div
                key={category.value}
                onClick={() => {
                  setSelectedCategory(
                    category.value === selectedCategory ? null : category.value
                  );
                }}
                className={`p-4 rounded-lg shadow cursor-pointer transition-transform hover:scale-105 ${
                  selectedCategory === category.value
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                style={{
                  backgroundColor: `${category.color}20`,
                  borderLeft: `4px solid ${category.color}`,
                }}
              >
                <div className="font-medium">{category.name}</div>
                <div className="text-lg font-semibold">
                  {formatAmount(categoryTotal.toString())}
                </div>
                <div className="text-sm text-gray-600">
                  {percentage.toFixed(1)}% of total
                </div>
                <div className="text-sm text-gray-600">
                  {
                    transactions.filter((t) => t.category === category.value)
                      .length
                  }{" "}
                  transactions
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Category Transaction Pie Chart */}
      {selectedCategory && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {CATEGORIES.find((c) => c.value === selectedCategory)?.name}{" "}
              Transactions
            </h2>
            <button
              onClick={() => {
                setSelectedCategory(null);
              }}
              className="px-3 py-1 bg-gray-200 rounded-md text-sm"
            >
              Close
            </button>
          </div>

          {filteredTransactions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Transaction Pie Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactionPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={renderCustomizedLabel}
                      className="cursor-default"
                    >
                      {transactionPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        formatAmount(value.toString())
                      }
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="p-2 bg-white border rounded shadow">
                              <p className="font-semibold">{data.name}</p>
                              <p>{data.date}</p>
                              <p className="text-right font-medium">
                                {formatAmount(data.value.toString())}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Transaction List */}
              <div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction, index) => (
                        <tr key={transaction._id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.date)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{
                                  backgroundColor:
                                    transactionPieData[index]?.color,
                                }}
                              />
                              {transaction.description}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                            {formatAmount(transaction.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td className="px-4 py-3"></td>
                        <td className="px-4 py-3 text-right text-sm font-medium">
                          Total:
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-bold">
                          {formatAmount(
                            filteredTransactions
                              .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                              .toString()
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Category Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-gray-600">Total Amount:</div>
                    <div className="font-medium">
                      {formatAmount(
                        filteredTransactions
                          .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                          .toString()
                      )}
                    </div>

                    <div className="text-gray-600">Transaction Count:</div>
                    <div className="font-medium">
                      {filteredTransactions.length}
                    </div>

                    <div className="text-gray-600">Average Amount:</div>
                    <div className="font-medium">
                      {formatAmount(
                        (
                          filteredTransactions.reduce(
                            (sum, t) => sum + parseFloat(t.amount),
                            0
                          ) / filteredTransactions.length
                        ).toString()
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No transactions found for this category.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
