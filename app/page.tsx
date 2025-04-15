import Test from "@/components/test";
import Transactions from "@/components/transactions/Transactions";
import TransactionTracking from "@/components/transactions/TransactionTracking";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Personal Finance Tracker
      </h1>
      <div className="flex justify-end my-10">
        <Link href={"/categories"}>
          <Button>Go to Categories</Button>
        </Link>
      </div>
      <h2 className="text-3xl font-bold mb-8">Transactions</h2>
      <Transactions />
    </div>
  );
}
