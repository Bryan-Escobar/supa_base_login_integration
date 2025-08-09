import { create } from 'zustand';
import { getValueFor, save } from './useSecureStorage';

type AuthState = {
    session: any;
    setSession: (sessionData: any) => void;
    getSession: () => Promise<void>; // ← Async function
};

export const useAuthStore = create<AuthState>((set, get) => ({
    session: null,
    setSession: (sessionData: any) => {
        set({ session: sessionData })
        save('session', JSON.stringify(sessionData))
    },
    getSession: async () => {
        try {
            const storedSession = await getValueFor('session');
            if (storedSession) {
                const parsedSession = JSON.parse(storedSession);
                set({ session: parsedSession }); // ← Usar set() directamente
                console.log('✅ Sesión recuperada del storage');
            } else {
                console.log('❌ No hay sesión guardada');
            }
        } catch (error) {
            console.log('❌ Error recuperando sesión:', error);
        }
    },
}));

