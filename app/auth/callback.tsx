import { supabase } from '@/lib/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function AuthCallback() {
    const router = useRouter();
    const params = useLocalSearchParams();

    useEffect(() => {
        console.log('🔄 AuthCallback ejecutándose...');
        console.log('📊 Params recibidos:', params);

        const handleAuthCallback = async () => {
            try {
                // Obtener la URL del callback desde los parámetros
                const callbackUrl = params.callbackUrl as string;
                const urlToProcess = callbackUrl ? decodeURIComponent(callbackUrl) : null;

                // Extraer parámetros del fragment (después del #)
                let accessToken = null;
                let refreshToken = null;

                if (urlToProcess) {
                    const fragmentMatch = urlToProcess.match(/#(.+)/);
                    if (fragmentMatch) {
                        const fragmentParams = new URLSearchParams(fragmentMatch[1]);
                        accessToken = fragmentParams.get('access_token');
                        refreshToken = fragmentParams.get('refresh_token');
                    }
                }

                // Si tenemos tokens, establecer la sesión manualmente
                if (accessToken && refreshToken) {
                    console.log('🎯 Estableciendo sesión con tokens...');

                    const { data: { session }, error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    });

                    if (error) {
                        console.error('❌ Error estableciendo sesión:', error);
                        router.replace('/');
                        return;
                    }

                    if (session) {
                        console.log('✅ Login exitoso!');
                        router.replace('/(tabs)/explore');
                        return;
                    }
                }

                // Si llegamos aquí, algo falló
                console.log('❌ No hay tokens válidos, volviendo al login');
                router.replace('/');
            } catch (error) {
                console.error('💥 Error procesando callback:', error);
                router.replace('/');
            }
        };

        handleAuthCallback();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Procesando autenticación...</Text>
        </View>
    );
}
