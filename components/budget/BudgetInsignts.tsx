import React from "react";

interface InsightsProps {
  type: string;
  message: string;
}

const BudgetInsignts = ({ insights }: { insights: InsightsProps[] }) => {
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Spending Insights</h2>
      <div className="space-y-4">
        {insights.map((insight, index) => {
          let bgColor = "bg-blue-50";
          let textColor = "text-blue-800";
          let borderColor = "border-blue-200";

          if (insight.type === "warning") {
            bgColor = "bg-red-50";
            textColor = "text-red-800";
            borderColor = "border-red-200";
          } else if (insight.type === "alert") {
            bgColor = "bg-yellow-50";
            textColor = "text-yellow-800";
            borderColor = "border-yellow-200";
          } else if (insight.type === "success") {
            bgColor = "bg-green-50";
            textColor = "text-green-800";
            borderColor = "border-green-200";
          }

          return (
            <div
              key={index}
              className={`p-4 rounded-md border ${bgColor} ${borderColor}`}
            >
              <p className={`text-sm ${textColor}`}>{insight.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetInsignts;
