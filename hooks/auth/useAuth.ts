import { supabase } from "@/lib/supabase";
import * as WebBrowser from 'expo-web-browser';
import { useState } from "react";
import { Alert } from "react-native";
import { useAuthStore } from "./useAuthStore";
import { deleteValue } from "./useSecureStorage";

export function useAuth() {

    const [loading, setLoading] = useState(true);
    const session = useAuthStore((state: any) => state.session);
    const setSession = useAuthStore((state: any) => state.setSession);
    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'onoffapp://auth/callback',
                }
            })

            if (error) {
                console.error('❌ Error de Supabase:', error);
                Alert.alert('Error', error.message)
                return
            }

            // Abrir manualmente el navegador si hay URL
            if (data?.url) {
                await WebBrowser.openBrowserAsync(data.url);
            } else {
                console.log('⚠️ No hay URL en la respuesta');
            }

        } catch (error) {
            console.error('Error durante login:', error)
            Alert.alert('Error', 'Algo salió mal durante el login')
        } finally {
            setLoading(false);
        }
    }

    const logOut = async () => {
        console.log('🔄 LogOut ejecutándose...');
        try {
            setLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('❌ Error de Supabase:', error);
                Alert.alert('Error', error.message)
                return
            }
            // Ya no necesitamos setSession(null) porque el listener lo hará automáticamente
            console.log('✅ Sesión cerrada exitosamente');
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            setLoading(false);
            setSession(null);
            deleteValue('session')
        }
    }

    return {
        signInWithGoogle,
        logOut,
        loading,
        session
    }
}