"use client";

import useFetchTransactions from "@/hooks/useFetchTransactions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Edit, Trash } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const TransactionList = () => {
  const { loading } = useFetchTransactions();
  const { allTransactions } = useAppContext();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">All Transactions</CardTitle>
          <CardDescription>View and manage your transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex gap-5 items-center justify-center">
              <span className="text-3xl">Loading ...</span>
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="">
              {allTransactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTransactions?.map((transaction) => (
                      <TableRow key={transaction._id} className="pt-3 h-12">
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="flex gap-8 items-center justify-center h-12">
                          <Edit
                            className="cursor-pointer hover:scale-105"
                            size={20}
                          />
                          <Trash
                            className="text-red-500 cursor-pointer hover:scale-110"
                            size={20}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="">No Transactions.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionList;
