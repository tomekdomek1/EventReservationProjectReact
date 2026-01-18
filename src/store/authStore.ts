import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserData } from '../types/Auth';

interface AuthState {
    token: string | null;
    user: UserData | null;
    login: (token: string, user: UserData) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            login: (token, user) => set({ token, user }),
            logout: () => set({ token: null, user: null }),
            isAuthenticated: () => {
                const state = get();
                return !!state.token; 
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
