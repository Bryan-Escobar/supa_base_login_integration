import { supabase } from '@/lib/supabase';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { deleteValue, getValueFor, save } from './useSecureStorage';

type AuthState = {
    session: any;
    setSession: (sessionData: any) => void;
    getSession: () => Promise<void>;
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


                //!!seteamos la sesión para supabase
                await supabase.auth.setSession(parsedSession);
            } else {
                console.log('❌ No hay sesión guardada');
            }
        } catch (error) {
            console.log('❌ Error recuperando sesión:', error);
        }
    },

    checkTokens: async () => {



        const session = get().session;
        if (!session) {
            console.log('❌ No hay sesión activa para verificar tokens');
            return;
        }

        const { access_token, refresh_token } = session;

        // Verificar si los tokens están presentes
        if (!access_token || !refresh_token) {
            console.log('❌ Tokens de sesión faltantes');
            return;
        }

        // Aquí puedes agregar la lógica para verificar la validez de los tokens
        if (tokenExpired(access_token)) {
            console.log('❌ El token de acceso ha expirado');
            if (!tokenExpired(refresh_token)) {
                //TODO: refresh access token
                const { data, error } = await supabase.auth.refreshSession({ refresh_token });
                if (error) {
                    console.log('❌ Error al refrescar el token de acceso:', error);

                    //eliminar sesion
                    set({ session: null });
                    deleteValue('session');
                    return false;
                }
                console.log('✅ Token de acceso refrescado exitosamente');
                set({ session: data.session });
                save('session', JSON.stringify(data));
                return true
            }
            else {
                //eliminar sesion
                set({ session: null });
                deleteValue('session');
                return false;
            }

        }
        console.log("tokens al dia")
        return true;

    }

}));

const tokenExpired = (token: string) => {
    const { exp } = jwtDecode<{ exp: number }>(token);
    const now = Date.now() / 1000; // Obtener el tiempo actual en segundos
    return now > exp;

}


