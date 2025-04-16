import Budget from "@/components/budget/Budget";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Personal Finance Tracker
      </h1>
      <div className="flex justify-between mt-10">
        <Link href={"/"}>
          <Button>
            <ArrowLeft />
            Home
          </Button>
        </Link>
        <Link href={"/categories"}>
          <Button className="bg-green-600">
            Go to categories
            <ArrowRight />
          </Button>
        </Link>
      </div>
      {/* <h2 className="text-3xl font-bold mb-8">Categories</h2> */}
      <Budget />
    </div>
  );
};

export default page;
