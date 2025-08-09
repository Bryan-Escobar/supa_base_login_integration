import { useAuthStore } from '@/hooks/auth/useAuthStore'
import { useAuth } from '@/hooks/auth/useAuth'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import React, { useEffect } from 'react'
import { Button, View } from 'react-native'

WebBrowser.maybeCompleteAuthSession()

const Index = () => {
  const router = useRouter()
  const { signInWithGoogle } = useAuth();
  const session = useAuthStore((state: any) => state.session);

  // 🔥 Si ya hay sesión, redirigir inmediatamente desde index
  useEffect(() => {
    if (session) {
      console.log("🚀 Session detectada en INDEX, redirigiendo a tabs...");
      router.replace('/(tabs)/explore');
    }
  }, [session]);



  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title={'Continuar con Google'} onPress={signInWithGoogle} />
    </View>
  )
}

export default Index