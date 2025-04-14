"use client";
import useFetchTransactions from "@/hooks/useFetchTransactions";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface TransactionType {
  _id: string;
  amount: string;
  date: string;
  description: string;
}

// const AppContext = createContext({});

const AppContext = createContext<{
  allTransactions: TransactionType[];
  setAllTransactions: Dispatch<SetStateAction<TransactionType[]>>;
}>({
  allTransactions: [],
  setAllTransactions: () => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [allTransactions, setAllTransactions] = useState<TransactionType[]>([]);
  const { fetchAllTransactions } = useFetchTransactions();

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  // =====================================
  return (
    <AppContext.Provider value={{ allTransactions, setAllTransactions }}>
      {children}
    </AppContext.Provider>
  );
};
