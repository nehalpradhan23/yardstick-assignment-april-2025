import connectDB from "@/db/connectDB";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { amount, date, description } = await req.json();

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
    return NextResponse.json(
      {
        success: false,
        message: "Error adding transaction",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const transactions = await Transaction.find(); // sorted latest first

    return NextResponse.json(
      {
        success: true,
        message: "All transactions fetched successfully",
        transactions,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching transactions:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch transactions",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
