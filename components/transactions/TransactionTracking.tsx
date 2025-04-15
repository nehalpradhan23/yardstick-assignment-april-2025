"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import useFetchTransactions from "@/hooks/useFetchTransactions";

interface newTransactionType {
  amount: string;
  date: string;
  description: string;
  category: string;
}

const newTransactionData = {
  amount: "",
  date: "",
  description: "",
  category: "",
};

// Predefined categories with colors
export const CATEGORIES = [
  { name: "Food & Groceries", color: "#FF6384", value: "food" },
  { name: "Bills & Utilities", color: "#36A2EB", value: "bills" },
  { name: "Transportation", color: "#FFCE56", value: "transport" },
  { name: "Entertainment", color: "#4BC0C0", value: "entertainment" },
  { name: "Shopping", color: "#9966FF", value: "shopping" },
  { name: "Health", color: "#FF9F40", value: "health" },
  { name: "Housing", color: "#8AC926", value: "housing" },
  { name: "Other", color: "#A0A0A0", value: "other" },
];

const TransactionTracking = () => {
  const [newTransaction, setNewTransaction] =
    useState<newTransactionType>(newTransactionData);

  const { fetchAllTransactions } = useFetchTransactions();

  const [errors, setErrors] = useState(newTransactionData);

  // ------------------------------------------------------
  const validateTransaction = (transaction: any) => {
    const newErrors = { amount: "", date: "", description: "", category: "" };
    if (!transaction.amount || isNaN(parseFloat(transaction.amount))) {
      newErrors.amount = "Amount is required and must be a number";
    }
    if (!transaction.date) {
      newErrors.date = "Date is required";
    }
    if (!transaction.description) {
      newErrors.description = "Description is required";
    }
    if (!transaction.category) {
      newErrors.category = "Category is required";
    }
    return newErrors;
  };

  // ------------------------------------------------------
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  // ------------------------------------------------------
  const handleAddTransaction = async () => {
    setErrors({
      amount: "",
      date: "",
      description: "",
      category: "",
    });
    let validationErrors = validateTransaction(newTransaction);
    if (
      validationErrors.amount !== "" ||
      validationErrors.date !== "" ||
      validationErrors.description !== "" ||
      validationErrors.category !== ""
    ) {
      // if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      validationErrors = {
        amount: "",
        date: "",
        description: "",
        category: "",
      };
      return;
    }

    try {
      const response = await axios.post("/api/transactions", newTransaction);
      console.log("response: ", response);
      if (response.data.success) {
        toast.success("Transaction added successfully");
        setNewTransaction(newTransactionData);
        fetchAllTransactions();
      }
    } catch (error) {
      toast.error("Error adding transaction");
      console.log(error);
    }
  };

  // =========================================================
  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add Transaction</CardTitle>
          <CardDescription>Enter your transaction details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-base font-semibold">Amount:</label>
              <Input
                type="number"
                name="amount"
                value={newTransaction?.amount}
                onChange={handleInputChange}
                placeholder="Add amount"
              />
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-semibold">Date:</label>
              <Input
                type="date"
                name="date"
                value={newTransaction?.date}
                onChange={handleInputChange}
              />
              {errors.date && (
                <p className="text-sm text-red-500 mt-1">{errors.date}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-semibold">Description:</label>
              <Input
                name="description"
                value={newTransaction?.description}
                onChange={handleInputChange}
                placeholder="Add description"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-semibold">Category:</label>
              <Select
                value={newTransaction.category}
                onValueChange={(value) =>
                  setNewTransaction((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectLabel>Fruits</SelectLabel> */}
                    {CATEGORIES.map((item, index) => (
                      <SelectItem key={index} value={item.value}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">{errors.category}</p>
              )}
            </div>
            <Button className="cursor-pointer" onClick={handleAddTransaction}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionTracking;
