import React from "react";
import TransactionList from "../transactions/TransactionList";
import TransactionTracking from "../transactions/TransactionTracking";
import CategoriesDashboard from "./CategoriesDashboard";

const Categories = () => {
  return (
    <div className="flex flex-col gap-5">
      {/* <TransactionTracking />
      <TransactionList /> */}
      <CategoriesDashboard />
    </div>
  );
};

export default Categories;
