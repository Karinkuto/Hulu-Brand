import create from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  username: string;
  password: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  lastLogin: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string, firstName: string, lastName: string, phone: string) => Promise<void>;
  checkUsernameExists: (username: string) => Promise<boolean>;
  promoteUser: (username: string) => void;
  demoteUser: (username: string) => void;
  removeUser: (username: string) => void;
}

const initialUsers: User[] = [
  { 
    username: 'admin', 
    password: 'admin123', 
    isAdmin: true, 
    firstName: 'Admin',
    lastName: 'User',
    phone: '0987654321',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      users: initialUsers,
      login: async (username, password) => {
        const user = get().users.find(u => u.username === username && u.password === password);
        if (user) {
          const updatedUser = { ...user, lastLogin: new Date().toISOString() };
          set(state => ({
            isAuthenticated: true,
            isAdmin: user.isAdmin,
            user: updatedUser,
            users: state.users.map(u => u.username === username ? updatedUser : u)
          }));
        } else {
          throw new Error('Invalid credentials');
        }
      },
      logout: () => {
        set({ isAuthenticated: false, isAdmin: false, user: null });
      },
      register: async (username, password, firstName, lastName, phone) => {
        const newUser: User = { 
          username, 
          password, 
          isAdmin: false, 
          firstName,
          lastName,
          phone,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        set(state => ({ 
          users: [...state.users, newUser],
          isAuthenticated: true, 
          isAdmin: false, 
          user: newUser
        }));
      },
      checkUsernameExists: async (username) => {
        return get().users.some(u => u.username === username);
      },
      promoteUser: (username) => {
        set(state => ({
          users: state.users.map(u => 
            u.username === username ? { ...u, isAdmin: true } : u
          )
        }));
      },
      demoteUser: (username) => {
        set(state => ({
          users: state.users.map(u => 
            u.username === username ? { ...u, isAdmin: false } : u
          )
        }));
      },
      removeUser: (username) => {
        set(state => ({
          users: state.users.filter(u => u.username !== username)
        }));
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);