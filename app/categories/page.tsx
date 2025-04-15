import Categories from "@/components/categories/Categories";

const page = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Personal Finance Tracker
      </h1>
      <h2 className="text-3xl font-bold mb-8">Categories</h2>
      <Categories />
    </div>
  );
};

export default page;
