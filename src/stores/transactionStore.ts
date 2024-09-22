// @ts-nocheck
import { create } from 'zustand';

interface Transaction {
  id: string;
  date: Date;
  status: 'completed' | 'pending' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  userId: string;
  userName: string; // Add this line
}

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
}

// Expanded mock transactions for a clothing store
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date('2023-06-01'),
    status: 'completed',
    total: 89.97,
    items: [
      { id: 'item1', name: 'Classic T-Shirt', quantity: 2, price: 19.99 },
      { id: 'item2', name: 'Slim Fit Jeans', quantity: 1, price: 49.99 },
    ],
    userId: '2',
    userName: 'John Doe', // Add user names
  },
  {
    id: '2',
    date: new Date('2023-06-02'),
    status: 'pending',
    total: 119.97,
    items: [
      { id: 'item3', name: 'Summer Dress', quantity: 3, price: 39.99 },
    ],
    userId: '3',
    userName: 'Jane Doe',
  },
  {
    id: '3',
    date: new Date('2023-06-03'),
    status: 'completed',
    total: 129.99,
    items: [
      { id: 'item4', name: 'Leather Jacket', quantity: 1, price: 129.99 },
    ],
    userId: '4',
    userName: 'Bob Smith',
  },
  {
    id: '4',
    date: new Date('2023-06-04'),
    status: 'completed',
    total: 159.98,
    items: [
      { id: 'item5', name: 'Running Shoes', quantity: 2, price: 79.99 },
    ],
    userId: '5',
    userName: 'Alice Johnson',
  },
  {
    id: '5',
    date: new Date('2023-06-05'),
    status: 'cancelled',
    total: 59.97,
    items: [
      { id: 'item1', name: 'Classic T-Shirt', quantity: 3, price: 19.99 },
    ],
    userId: '2',
    userName: 'John Doe',
  },
  // Add more transactions to cover a 30-day period
  {
    id: '31',
    date: new Date('2023-05-15'),
    status: 'completed',
    total: 299.97,
    items: [
      { id: 'item4', name: 'Leather Jacket', quantity: 1, price: 199.99 },
      { id: 'item8', name: 'Wool Sweater', quantity: 1, price: 79.99 },
      { id: 'item9', name: 'Silk Scarf', quantity: 1, price: 19.99 },
    ],
    userId: '7',
    userName: 'Alice Johnson',
  },
  {
    id: '32',
    date: new Date('2023-05-20'),
    status: 'cancelled',
    total: 69.99,
    items: [
      { id: 'item10', name: 'Denim Jacket', quantity: 1, price: 69.99 },
    ],
    userId: '9',
    userName: 'Bob Smith',
  },
  {
    id: '33',
    date: new Date('2023-05-25'),
    status: 'pending',
    total: 149.97,
    items: [
      { id: 'item1', name: 'Classic T-Shirt', quantity: 3, price: 19.99 },
      { id: 'item11', name: 'Summer Hat', quantity: 1, price: 24.99 },
      { id: 'item5', name: 'Running Shoes', quantity: 1, price: 89.99 },
    ],
    userId: '10',
    userName: 'Charlie Brown',
  },
];

// Generate more transactions for the last 30 days
for (let i = 6; i <= 30; i++) {
  mockTransactions.push({
    id: i.toString(),
    date: new Date(`2023-06-${i.toString().padStart(2, '0')}`),
    status: Math.random() > 0.8 ? 'pending' : 'completed',
    total: Math.floor(Math.random() * 200) + 50,
    items: [
      { id: `item${i}`, name: 'Random Product', quantity: Math.floor(Math.random() * 3) + 1, price: Math.floor(Math.random() * 100) + 10 },
    ],
    userId: Math.floor(Math.random() * 4 + 2).toString(),
    userName: `User ${Math.floor(Math.random() * 4 + 2)}`, // Add random user names
  });
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: mockTransactions,
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),
}));