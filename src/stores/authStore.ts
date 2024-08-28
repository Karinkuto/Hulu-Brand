import create from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  username: string;
  password: string;
  isAdmin: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: { username: string } | null;
  users: User[];
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string, firstName: string, lastName: string, phone: string) => Promise<void>;
  checkUsernameExists: (username: string) => Promise<boolean>;
}

const initialUsers: User[] = [
  { username: 'user', password: 'password', isAdmin: false },
  { username: 'admin', password: 'admin123', isAdmin: true },
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
          set({ isAuthenticated: true, isAdmin: user.isAdmin, user: { username: user.username } });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      logout: () => {
        set({ isAuthenticated: false, isAdmin: false, user: null });
      },
      register: async (username, password, firstName, lastName, phone) => {
        const newUser: User = { username, password, isAdmin: false };
        set(state => ({ 
          users: [...state.users, newUser],
          isAuthenticated: true, 
          isAdmin: false, 
          user: { username } 
        }));
      },
      checkUsernameExists: async (username) => {
        return get().users.some(u => u.username === username);
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);