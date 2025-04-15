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

interface AppContextProps {
  allTransactions: TransactionType[];
  setAllTransactions: Dispatch<SetStateAction<TransactionType[]>>;
  deleteTransactionModalOpen: boolean;
  setDeleteTransactionModalOpen: Dispatch<SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextProps>({
  allTransactions: [],
  setAllTransactions: () => {},
  deleteTransactionModalOpen: false,
  setDeleteTransactionModalOpen: () => {},
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
  const [deleteTransactionModalOpen, setDeleteTransactionModalOpen] =
    useState(false);
  const { fetchAllTransactions } = useFetchTransactions();

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  // =====================================
  return (
    <AppContext.Provider
      value={{
        allTransactions,
        setAllTransactions,
        deleteTransactionModalOpen,
        setDeleteTransactionModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
