import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';
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
                console.log('🔐 Procesando callback de OAuth...');

                // Obtener la URL del callback desde los parámetros
                const callbackUrl = params.callbackUrl as string;
                console.log('🔗 URL del callback:', callbackUrl);

                // Si no hay URL en parámetros, intentar con getInitialURL como fallback
                const urlToProcess = callbackUrl ? decodeURIComponent(callbackUrl) : await Linking.getInitialURL();
                console.log('🔗 URL a procesar:', urlToProcess);

                // Extraer parámetros del fragment (después del #)
                let accessToken = null;
                let refreshToken = null;

                if (urlToProcess) {
                    const fragmentMatch = urlToProcess.match(/#(.+)/);
                    if (fragmentMatch) {
                        const fragment = fragmentMatch[1];
                        console.log('🧩 Fragment encontrado:', fragment);

                        const fragmentParams = new URLSearchParams(fragment);
                        accessToken = fragmentParams.get('access_token');
                        refreshToken = fragmentParams.get('refresh_token');

                        console.log('🔑 Access token encontrado:', !!accessToken);
                        console.log('🔄 Refresh token encontrado:', !!refreshToken);
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
                        console.log('✅ Sesión establecida correctamente!');
                        console.log('');
                        console.log('=================== DATOS DEL USUARIO ===================');
                        console.log('👤 Usuario completo:', JSON.stringify(session.user, null, 2));
                        console.log('');
                        console.log('📧 Email:', session.user.email);
                        console.log('🆔 ID:', session.user.id);
                        console.log('� Teléfono:', session.user.phone || 'No disponible');
                        console.log('📅 Creado:', session.user.created_at);
                        console.log('🔄 Última actualización:', session.user.updated_at);
                        console.log('✅ Email verificado:', session.user.email_confirmed_at ? 'Sí' : 'No');
                        console.log('');
                        console.log('=============== METADATOS DE LA APP ===============');
                        console.log('🔗 Proveedor:', session.user.app_metadata?.provider || 'No disponible');
                        console.log('🔗 Proveedores:', session.user.app_metadata?.providers || []);
                        console.log('');
                        console.log('=============== METADATOS DEL USUARIO ===============');
                        console.log('📊 Metadata completa:', JSON.stringify(session.user.user_metadata, null, 2));
                        console.log('👤 Nombre completo:', session.user.user_metadata?.full_name || 'No disponible');
                        console.log('👤 Nombre:', session.user.user_metadata?.name || 'No disponible');
                        console.log('🖼️ Avatar URL:', session.user.user_metadata?.avatar_url || 'No disponible');
                        console.log('🖼️ Foto:', session.user.user_metadata?.picture || 'No disponible');
                        console.log('🏢 Dominio:', session.user.user_metadata?.custom_claims?.hd || 'No disponible');
                        console.log('🆔 Provider ID:', session.user.user_metadata?.provider_id || 'No disponible');
                        console.log('🔐 Sub:', session.user.user_metadata?.sub || 'No disponible');
                        console.log('📧 Email verificado:', session.user.user_metadata?.email_verified ? 'Sí' : 'No');
                        console.log('📞 Teléfono verificado:', session.user.user_metadata?.phone_verified ? 'Sí' : 'No');
                        console.log('');
                        console.log('=============== INFORMACIÓN DE SESIÓN ===============');
                        console.log('🎫 Access Token:', session.access_token ? 'Disponible' : 'No disponible');
                        console.log('🔄 Refresh Token:', session.refresh_token ? 'Disponible' : 'No disponible');
                        console.log('⏰ Expira en:', session.expires_in || 'No especificado');
                        console.log('📅 Expira el:', session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'No especificado');
                        console.log('🆔 Token Type:', session.token_type || 'No disponible');
                        console.log('==========================================');
                        console.log('');
                        router.replace('/(tabs)/explore');
                        return;
                    }
                }

                // Fallback: intentar obtener sesión normalmente
                console.log('🔄 Intentando obtener sesión existente...');
                await new Promise(resolve => setTimeout(resolve, 1000));

                const { data: { session: fallbackSession }, error: fallbackError } = await supabase.auth.getSession();

                console.log('📋 Respuesta de Supabase:', { session: !!fallbackSession, error: fallbackError });

                if (fallbackError) {
                    console.error('❌ Error en callback:', fallbackError);
                    router.replace('/');
                    return;
                }

                if (fallbackSession) {
                    console.log('✅ Usuario autenticado:', fallbackSession.user);
                    console.log('📧 Email:', fallbackSession.user.email);
                    console.log('🆔 ID:', fallbackSession.user.id);
                    console.log('📊 Metadata:', fallbackSession.user.user_metadata);
                    console.log('👤 Nombre:', fallbackSession.user.user_metadata?.full_name);
                    console.log('🖼️ Avatar:', fallbackSession.user.user_metadata?.avatar_url);

                    // Redirigir a las tabs principales
                    console.log('🚀 Redirigiendo a tabs...');
                    router.replace('/(tabs)/explore');
                } else {
                    console.log('❌ No hay sesión, volviendo al login');
                    router.replace('/');
                }
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
