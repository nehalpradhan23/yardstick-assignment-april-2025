"use client";
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
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useAppContext } from "@/context/AppContext";
const MonthlyChart = () => {
  const { allTransactions } = useAppContext();

  // const getMonthlyData = () => {
  //   const monthData: any = {};

  //   allTransactions.forEach((transaction) => {
  //     const month = transaction.date.substring(0, 7); // Format: YYYY-MM
  //     if (!monthData[month]) {
  //       monthData[month] = 0;
  //     }
  //     monthData[month] += transaction.amount;
  //   });

  //   return Object.keys(monthData)
  //     .map((month) => ({
  //       month: month,
  //       expenses: monthData[month],
  //     }))
  //     .sort((a, b) => a.month.localeCompare(b.month));
  // };

  const getMonthlyData = () => {
    const monthData: Record<string, number> = {};

    allTransactions.forEach((transaction) => {
      const month = transaction.date.substring(0, 7); // Format: YYYY-MM
      const amount = parseFloat(transaction.amount); // Convert to number

      if (!monthData[month]) {
        monthData[month] = 0;
      }
      monthData[month] += amount;
    });

    return Object.keys(monthData)
      .map((month) => ({
        month,
        expenses: monthData[month],
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };
  return (
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
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="expenses" fill="#8884d8" name="Expenses ($)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyChart;
