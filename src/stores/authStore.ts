import create from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  lastLogin: Date;
  phone?: string; // Add this line
  firstName?: string; // Add this line
  lastName?: string; // Add this line
  createdAt?: Date; // Add this line
}

type AuthStore = {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  user: User | null;
  promoteUser: (userId: string) => void;
  demoteUser: (userId: string) => void;
  removeUser: (userId: string) => void;
};

const mockUsers: User[] = [
  { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin', lastLogin: new Date('2023-06-10'), phone: '0912345678', firstName: 'Admin', lastName: 'User', createdAt: new Date('2023-01-01') },
  { id: '2', username: 'user', email: 'user@example.com', role: 'user', lastLogin: new Date('2023-06-09'), phone: '0987654321', firstName: 'Regular', lastName: 'User', createdAt: new Date('2023-02-01') },
  // ... update other mock users similarly ...
];

export const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => ({
      users: mockUsers,
      currentUser: null,
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      login: (username, password) => {
        const user = mockUsers.find(u => u.username === username);
        if (user && ((username === 'admin' && password === 'admin123') || username !== 'admin')) {
          set({ currentUser: user, isAuthenticated: true, isAdmin: user.role === 'admin', user: user });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUser: null, isAuthenticated: false, isAdmin: false, user: null }),
      promoteUser: (userId: string) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, role: 'admin' } : user
          ),
        }));
      },
      demoteUser: (userId: string) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId ? { ...user, role: 'user' } : user
          ),
        }));
      },
      removeUser: (userId: string) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== userId),
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);