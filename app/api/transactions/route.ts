import connectDB from "@/db/connectDB";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { amount, date, description, category } = await req.json();
    // console.log(amount, date, description, category);

    const newTransaction = await Transaction.create({
      amount,
      date,
      description,
      category,
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

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Transaction deleted.", deletedTransaction },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error deleting transaction: ", error.message);
    return NextResponse.json(
      { success: false, message: "Error deleting transaction" },
      { status: 501 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { _id, amount, description, category } = await req.json();

    if (!_id || !amount || !description || !category) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      _id,
      { amount, description, category },
      { new: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Transaction updated successfully",
        transaction: updatedTransaction,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating transaction:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update transaction",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
