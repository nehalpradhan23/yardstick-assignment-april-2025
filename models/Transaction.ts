import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    amount: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export default Transaction;
