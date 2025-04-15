"use client";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// interface TransactionType {
//   _id: string;
//   amount: string;
//   date: string;
//   description: string;
// }

const useFetchTransactions = () => {
  // const [allTransactions, setAllTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(false);
  const { allTransactions, setAllTransactions } = useAppContext();

  const fetchAllTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/transactions");
      setAllTransactions(res?.data?.transactions);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching all transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  // console.log(allTransactions);

  return { fetchAllTransactions, loading };
};

export default useFetchTransactions;
