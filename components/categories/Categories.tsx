import React from "react";
import TransactionList from "../transactions/TransactionList";
import TransactionTracking from "../transactions/TransactionTracking";

const Categories = () => {
  return (
    <div className="flex flex-col gap-5">
      <TransactionTracking />
      <TransactionList />
    </div>
  );
};

export default Categories;
