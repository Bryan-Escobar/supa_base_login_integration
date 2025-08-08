import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    session: null,
    setSession: (sessionData: any) => set({ session: sessionData }),
}));

