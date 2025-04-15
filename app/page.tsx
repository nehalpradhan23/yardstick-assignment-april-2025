import Test from "@/components/test";
import Transactions from "@/components/transactions/Transactions";
import TransactionTracking from "@/components/transactions/TransactionTracking";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Personal Finance Tracker
      </h1>
      <h2 className="text-3xl font-bold mb-8">Transactions</h2>
      <Transactions />
    </div>
  );
}
