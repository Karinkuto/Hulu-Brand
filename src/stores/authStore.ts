import create from 'zustand';
import { persist } from 'zustand/middleware';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  lastLogin: Date;
  phone?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  password: string;
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
  register: (username: string, password: string, firstName: string, lastName: string, phone: string) => boolean;
  clearStorage: () => void;
};

const mockUsers: User[] = [
  { 
    id: '1', 
    username: 'admin', 
    password: 'admin123', 
    email: 'admin@example.com', 
    role: 'admin', 
    lastLogin: new Date(), 
    phone: '0912345678', 
    firstName: 'Admin', 
    lastName: 'User', 
    createdAt: new Date('2023-01-01') 
  }
];

export const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => ({
      users: mockUsers,
      currentUser: null,
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      login: async (username: string, password: string) => {
        const user = get().users.find(u => u.username === username);
        if (user) {
          if (username === 'admin' && password === 'admin123') {
            set({ currentUser: user, isAuthenticated: true, isAdmin: true, user: user });
            return true;
          } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
              set({ 
                currentUser: user, 
                isAuthenticated: true, 
                isAdmin: user.role === 'admin', 
                user: user 
              });
              return true;
            }
          }
        }
        return false;
      },
      logout: () => set({ currentUser: null, isAuthenticated: false, isAdmin: false, user: null }),
      promoteUser: (userId: string) => {
        set((state) => {
          const updatedUsers = state.users.map((user) =>
            user.id === userId ? { ...user, role: 'admin' } : user
          );
          const updatedCurrentUser = state.currentUser && state.currentUser.id === userId
            ? { ...state.currentUser, role: 'admin' }
            : state.currentUser;
          return {
            users: updatedUsers,
            currentUser: updatedCurrentUser,
            isAdmin: updatedCurrentUser?.role === 'admin',
            user: updatedCurrentUser
          };
        });
      },
      demoteUser: (userId: string) => {
        set((state) => {
          const updatedUsers = state.users.map((user) =>
            user.id === userId ? { ...user, role: 'user' } : user
          );
          const updatedCurrentUser = state.currentUser && state.currentUser.id === userId
            ? { ...state.currentUser, role: 'user' }
            : state.currentUser;
          return {
            users: updatedUsers,
            currentUser: updatedCurrentUser,
            isAdmin: updatedCurrentUser?.role === 'admin',
            user: updatedCurrentUser
          };
        });
      },
      removeUser: (userId: string) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== userId),
        }));
      },
      register: async (username, password, firstName, lastName, phone) => {
        const existingUser = get().users.find(u => u.username === username);
        if (existingUser) {
          return false;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: User = {
          id: (get().users.length + 1).toString(),
          username,
          email: `${username}@example.com`,
          role: 'user',
          lastLogin: new Date(),
          phone,
          firstName,
          lastName,
          createdAt: new Date(),
          password: hashedPassword,
        };
        set(state => ({ 
          users: [...state.users, newUser],
          currentUser: newUser,
          isAuthenticated: true,
          isAdmin: false,
          user: newUser
        }));
        return true;
      },
      clearStorage: () => {
        localStorage.removeItem('auth-storage');
        set({ users: mockUsers, currentUser: null, isAuthenticated: false, isAdmin: false, user: null });
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage, // Ensure we're using localStorage
    }
  )
);
