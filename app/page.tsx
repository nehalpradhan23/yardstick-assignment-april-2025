import Transactions from "@/components/transactions/Transactions";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Personal Finance Tracker
      </h1>
      <div className="flex gap-4 justify-end mt-20 mb-10">
        <Link href={"/categories"}>
          <Button className="bg-green-600">
            Go to Categories
            <ArrowRight />
          </Button>
        </Link>
        <Link href={"/budget"}>
          <Button className="bg-blue-600">
            Manage Budget
            <ArrowRight />
          </Button>
        </Link>
      </div>
      <h2 className="text-3xl font-bold mb-8">Transactions</h2>
      <Transactions />
    </div>
  );
}
