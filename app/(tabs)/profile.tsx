import { useAuth } from '@/hooks/auth/useAuth';
import { useAuthStore } from '@/hooks/auth/useAuthStore';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { logOut } = useAuth();
    const session = useAuthStore((state: any) => state.session);
    const setSession = useAuthStore((state: any) => state.setSession);
    useEffect(() => {
        supabase.auth.setSession(session);
        getUserData();
    }, []);

    const getUserData = async () => {
        try {
            //supaabse.auth.getUser() obtiene el usuario actual de la sesión establecido en el setSession del callback
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                Alert.alert('Error', error.message);
                return;
            }

            setUser(user);
        } catch (error) {
            console.error('Error obteniendo usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Cargando perfil...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>No hay usuario logueado</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil de Usuario</Text>

            {user.user_metadata?.avatar_url && (
                <Image
                    source={{ uri: user.user_metadata.avatar_url }}
                    style={styles.avatar}
                />
            )}

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.value}>
                    {user.user_metadata?.full_name || 'No disponible'}
                </Text>

                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user.email}</Text>

                <Text style={styles.label}>ID:</Text>
                <Text style={styles.value}>{user.id}</Text>

                <Text style={styles.label}>Proveedor:</Text>
                <Text style={styles.value}>
                    {user.app_metadata?.provider || 'Google'}
                </Text>

                <Text style={styles.label}>Cuenta creada:</Text>
                <Text style={styles.value}>
                    {new Date(user.created_at).toLocaleDateString()}
                </Text>
            </View>

            <View style={styles.infoContainer}
            >
                <Pressable style={{ width: '60%', backgroundColor: 'red', padding: 10, borderRadius: 10 }} onPress={logOut}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>Cerrar Sesión</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
    },
    infoContainer: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    value: {
        fontSize: 16,
        marginTop: 5,
        color: '#666',
    },
});
