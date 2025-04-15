import MonthlyChart from "./MonthlyChart";
import TransactionList from "./TransactionList";
import TransactionTracking from "./TransactionTracking";

const Transactions = () => {
  return (
    <div className="flex flex-col gap-5">
      <TransactionTracking />
      <TransactionList />
      <MonthlyChart />
    </div>
  );
};

export default Transactions;
