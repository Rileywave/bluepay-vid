
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserData {
  fullName?: string;
  email?: string;
  profileImage?: string;
}

interface Transaction {
  id: number;
  type: string;
  amount: string;
  date: string;
  status: 'Completed' | 'Processing' | 'Failed';
  recipient?: string;
}

type ThemeMode = 'dark' | 'light' | 'system' | 'device';

interface UserState {
  userData: UserData | null;
  userPin: string;
  themeMode: ThemeMode;
  balance: number;
  balanceVisible: boolean;
  transactions: Transaction[];
  setUserData: (data: UserData) => void;
  setUserPin: (pin: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  clearUserData: () => void;
  updateBalance: (amount: number) => void;
  addTransaction: (transaction: Transaction) => void;
  toggleBalanceVisibility: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userData: null,
      userPin: '',
      themeMode: 'light',
      balance: 200000, // Initial balance of 200,000
      balanceVisible: true,
      transactions: [],
      setUserData: (data) => set((state) => ({
        userData: { ...state.userData, ...data }
      })),
      setUserPin: (pin) => set({ userPin: pin }),
      setThemeMode: (mode) => set({ themeMode: mode }),
      clearUserData: () => set({ userData: null, userPin: '' }),
      updateBalance: (amount) => set((state) => ({
        balance: state.balance + amount
      })),
      addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions]
      })),
      toggleBalanceVisibility: () => set((state) => ({
        balanceVisible: !state.balanceVisible
      })),
    }),
    {
      name: 'bluepay-user-storage',
    }
  )
);
