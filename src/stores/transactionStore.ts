// @ts-nocheck
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface TransactionItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Transaction {
  id: string;
  date: string;
  total: number;
  items: TransactionItem[];
  userId: string;
  userName: string;
}

type TransactionStore = {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (transactionId: string) => void;
  getTransactionsByUserId: (userId: string) => Transaction[];
  getTransactionById: (transactionId: string) => Transaction | undefined;
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-02-15',
    total: 149.97,
    items: [
      { id: 'item1', name: 'Classic T-Shirt', quantity: 3, price: 19.99 },
      { id: 'item2', name: 'Jeans', quantity: 2, price: 45.00 },
    ],
    userId: '1',
    userName: 'John Smith'
  },
  {
    id: '2',
    date: '2024-02-14',
    total: 159.97,
    items: [
      { id: 'item3', name: 'Summer Dress', quantity: 3, price: 39.99 },
    ],
    userId: '3',
    userName: 'Jane Doe'
  },
  {
    id: '3',
    date: '2024-02-13',
    total: 129.99,
    items: [
      { id: 'item4', name: 'Leather Jacket', quantity: 1, price: 129.99 },
    ],
    userId: '4',
    userName: 'Bob Smith'
  },
  {
    id: '4',
    date: '2024-02-12',
    total: 159.98,
    items: [
      { id: 'item5', name: 'Running Shoes', quantity: 2, price: 79.99 },
    ],
    userId: '5',
    userName: 'Alice Johnson'
  },
  {
    id: '5',
    date: '2024-02-11',
    total: 59.97,
    items: [
      { id: 'item1', name: 'Classic T-Shirt', quantity: 3, price: 19.99 },
    ],
    userId: '2',
    userName: 'John Doe'
  },
  {
    id: '31',
    date: '2024-01-15',
    total: 19.99,
    items: [
      { id: 'item9', name: 'Silk Scarf', quantity: 1, price: 19.99 },
    ],
    userId: '7',
    userName: 'Alice Johnson'
  },
  {
    id: '32',
    date: '2024-01-14',
    total: 69.99,
    items: [
      { id: 'item10', name: 'Denim Jacket', quantity: 1, price: 69.99 },
    ],
    userId: '9',
    userName: 'Bob Smith'
  },
  {
    id: '33',
    date: '2024-01-13',
    total: 89.99,
    items: [
      { id: 'item5', name: 'Running Shoes', quantity: 1, price: 89.99 },
    ],
    userId: '10',
    userName: 'Charlie Brown'
  }
];

export const useTransactionStore = create(
  persist<TransactionStore>(
    (set, get) => ({
      transactions: mockTransactions,
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
        })),
      removeTransaction: (transactionId) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== transactionId),
        })),
      getTransactionsByUserId: (userId) =>
        get().transactions.filter((t) => t.userId === userId),
      getTransactionById: (transactionId) =>
        get().transactions.find((t) => t.id === transactionId),
    }),
    {
      name: 'transaction-storage',
      getStorage: () => localStorage,
    }
  )
);
