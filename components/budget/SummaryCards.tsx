import { TransactionType } from "@/context/AppContext";
import React from "react";

const SummaryCards = ({
  totalExpenses,
  transactions,
  currentMonthTransactions,
}: {
  totalExpenses: number;
  transactions: TransactionType[];
  currentMonthTransactions: TransactionType[];
}) => {
  const formatAmount = (amount: string | number): string => {
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;
    return numericAmount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-gray-500 text-sm uppercase mb-2">Total Expenses</h2>
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
        <h2 className="text-gray-500 text-sm uppercase mb-2">
          This Month's Expenses
        </h2>
        <p className="text-3xl font-bold">
          {formatAmount(
            currentMonthTransactions.reduce(
              (sum, t) => sum + parseFloat(t.amount),
              0
            )
          )}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
