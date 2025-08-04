import { supabase } from '@/lib/supabase'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import { Alert, Button, View } from 'react-native'

WebBrowser.maybeCompleteAuthSession()


const Index = () => {
  const router = useRouter()

  const signInWithGoogle = async () => {
    console.log('🔵 Botón presionado - iniciando login...');

    try {
      console.log('🔵 Llamando a supabase.auth.signInWithOAuth...');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'onoffapp://auth/callback',
        }
      })

      console.log('🔵 Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('❌ Error de Supabase:', error);
        Alert.alert('Error', error.message)
        return
      }

      console.log('✅ Login iniciado:', data)

      // Abrir manualmente el navegador si hay URL
      if (data?.url) {
        console.log('🌐 Abriendo navegador con URL:', data.url);
        await WebBrowser.openBrowserAsync(data.url);
      } else {
        console.log('⚠️ No hay URL en la respuesta');
      }

    } catch (error) {
      console.error('Error durante login:', error)
      Alert.alert('Error', 'Algo salió mal durante el login')
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title={'Continuar con Google'} onPress={signInWithGoogle} />
    </View>
  )
}

export default Index