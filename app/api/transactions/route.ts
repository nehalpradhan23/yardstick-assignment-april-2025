import connectDB from "@/db/connectDB";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await connectDB();
    const { amount, date, description } = await req.json();

    console.log(amount, date, description);
    const newTransaction = await Transaction.create({
      amount,
      date,
      description,
    });

    if (newTransaction) {
      return NextResponse.json(
        {
          success: true,
          message: "Transaction added successfully",
          transaction: newTransaction,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Error in adding Transaction" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.log("error in adding transaction", error.message);
    NextResponse.json(
      {
        success: false,
        message: "Error adding transaction",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
