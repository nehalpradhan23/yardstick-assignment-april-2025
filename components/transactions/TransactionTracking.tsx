"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import useFetchTransactions from "@/hooks/useFetchTransactions";

interface newTransactionType {
  amount: string;
  date: string;
  description: string;
}

const newTransactionData = {
  amount: "",
  date: "",
  description: "",
};

const TransactionTracking = () => {
  const [newTransaction, setNewTransaction] =
    useState<newTransactionType>(newTransactionData);

  const { fetchAllTransactions } = useFetchTransactions();

  const [errors, setErrors] = useState(newTransactionData);

  // ------------------------------------------------------
  const validateTransaction = (transaction: any) => {
    const newErrors = { amount: "", date: "", description: "" };
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
    });
    let validationErrors = validateTransaction(newTransaction);
    if (
      validationErrors.amount !== "" ||
      validationErrors.date !== "" ||
      validationErrors.description !== ""
    ) {
      // if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      validationErrors = { amount: "", date: "", description: "" };
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
      <h1 className="text-3xl font-bold mb-8 text-center">
        Personal Finance Tracker
      </h1>

      <div className="">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add Transaction</CardTitle>
            <CardDescription>Enter your transaction details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="">
                <label>Amount:</label>
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
              <div className="">
                <label>Date:</label>
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
              <div className="">
                <label>Description:</label>
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
              <Button className="cursor-pointer" onClick={handleAddTransaction}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionTracking;
