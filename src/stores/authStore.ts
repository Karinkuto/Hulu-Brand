import create from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: { username: string } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  login: async (username, password) => {
    // Simple check for admin credentials
    if (username === 'admin' && password === 'admin') {
      set({ isAuthenticated: true, isAdmin: true, user: { username } });
    } else {
      set({ isAuthenticated: true, isAdmin: false, user: { username } });
    }
  },
  logout: () => {
    set({ isAuthenticated: false, isAdmin: false, user: null });
  },
  register: async (username, password) => {
    // For simplicity, just set as authenticated (non-admin) user
    set({ isAuthenticated: true, isAdmin: false, user: { username } });
  },
}));