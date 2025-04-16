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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

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
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CATEGORIES } from "./TransactionTracking";

const TransactionList = () => {
  const { loading, fetchAllTransactions } = useFetchTransactions();

  const [transactionToDelete, setTransactionToDelete] = useState<string>("");
  const [transactionToEdit, setTransactionToEdit] = useState({
    id: "",
    amount: "",
    description: "",
    category: "",
  });

  const [editTransactionModalOpen, setEditTransactionModalOpen] =
    useState(false);

  const {
    allTransactions,
    setDeleteTransactionModalOpen,
    deleteTransactionModalOpen,
  } = useAppContext();

  // =====================================================
  const handleDeleteTransaction = (id: string) => {
    setDeleteTransactionModalOpen(true);
    setTransactionToDelete(id);
  };

  const handleEditTransaction = (
    id: string,
    amount: string,
    description: string,
    category: string
  ) => {
    setEditTransactionModalOpen(true);
    setTransactionToEdit({
      id: id,
      amount: amount,
      description: description,
      category: category,
    });
  };

  console.log(transactionToEdit);

  // =================================================

  const confirmDeleteTransaction = async () => {
    try {
      const response = await axios.delete("api/transactions", {
        data: { id: transactionToDelete },
      });
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchAllTransactions();
        closeTransactionModal();
      } else {
        toast.error("Error deleting transaction");
      }
    } catch (error: any) {
      console.log(error?.response?.data?.message || error?.message);
    }
  };

  const handleEditTransactionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setTransactionToEdit((prev) => ({ ...prev, [name]: value }));
  };

  const confirmEditTransaction = async () => {
    try {
      const response = await axios.patch("api/transactions", {
        _id: transactionToEdit.id,
        amount: transactionToEdit.amount,
        description: transactionToEdit.description,
        category: transactionToEdit.category,
      });
      console.log(response);

      if (response.data.success) {
        toast.success(response.data.message);
        fetchAllTransactions();
        setEditTransactionModalOpen(false);
      } else {
        toast.error("Error updating Transaction");
      }
    } catch (error) {
      console.log("Error updating Transaction");
      toast.error("Error updating Transaction");
    }
  };

  // =================================================================
  const closeTransactionModal = () => {
    setDeleteTransactionModalOpen(false);
    setEditTransactionModalOpen(false);
    setTransactionToDelete("");
  };

  return (
    <div>
      {/* ========================================================= */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">All Transactions</CardTitle>
          <CardDescription>View and manage your transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-5 items-center justify-center">
              {/* <span className="text-3xl">Loading ...</span> */}
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="h-[400px] w-full overflow-y-scroll">
              {allTransactions.length > 0 ? (
                <Table className="">
                  <TableHeader>
                    {/* <TableHeader className="sticky top-0 bg-gray-100 z-10"> */}
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="">
                    {allTransactions?.map((transaction) => (
                      <TableRow key={transaction._id} className="">
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.amount}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell
                          style={{
                            color: CATEGORIES.find(
                              (item) => item.value === transaction.category
                            )?.color,
                            fontWeight: "500",
                          }}
                        >
                          {CATEGORIES.find(
                            (item) => item.value === transaction.category
                          )?.name || transaction.category}
                        </TableCell>
                        <TableCell className="flex gap-8 items-center justify-center h-12">
                          <Edit
                            className="cursor-pointer hover:scale-105"
                            size={20}
                            onClick={() => {
                              handleEditTransaction(
                                transaction._id,
                                transaction.amount,
                                transaction.description,
                                transaction.category
                              );
                            }}
                          />
                          <Trash
                            className="text-red-500 cursor-pointer hover:scale-110"
                            size={20}
                            onClick={() =>
                              handleDeleteTransaction(transaction._id)
                            }
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
      {/* delete transaction dialog ======================================== */}
      <Dialog
        open={deleteTransactionModalOpen}
        onOpenChange={closeTransactionModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Delete Transaction?</DialogTitle>
            <DialogDescription>
              Delete the transaction? You cannot undo this task?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end">
            <Button onClick={confirmDeleteTransaction} variant={"destructive"}>
              Confirm
            </Button>
            <Button onClick={closeTransactionModal}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* edit transaction dialog ======================================== */}
      <Dialog
        open={editTransactionModalOpen}
        onOpenChange={closeTransactionModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Transaction</DialogTitle>
            {/* <DialogDescription>
              Delete the transaction? You cannot undo this task?
            </DialogDescription> */}
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <span>Amount</span>
              <Input
                name="amount"
                onChange={handleEditTransactionChange}
                value={transactionToEdit.amount}
              />
            </div>
            <div className="flex flex-col gap-3">
              <span>Description</span>
              <Input
                name="description"
                onChange={handleEditTransactionChange}
                value={transactionToEdit.description}
              />
            </div>
            <div className="flex flex-col gap-3">
              <span>Category</span>
              <Select
                name="category"
                value={transactionToEdit.category}
                onValueChange={(value) =>
                  setTransactionToEdit((prev) => ({ ...prev, category: value }))
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
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <Button onClick={confirmEditTransaction} variant={"destructive"}>
              Confirm
            </Button>
            <Button onClick={closeTransactionModal}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionList;
