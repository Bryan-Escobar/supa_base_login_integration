import { useAuth } from '@/hooks/auth/useAuth'
import { useAuthStore } from '@/hooks/auth/useAuthStore'
import { Redirect, useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import { Button, View } from 'react-native'

WebBrowser.maybeCompleteAuthSession()

const Index = () => {
  const router = useRouter()
  const { signInWithGoogle } = useAuth();
  const session = useAuthStore((state: any) => state.session);

  // Si hay sesión, redirigir declarativamente
  if (session) {
    return <Redirect href="/(tabs)/explore" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title={'Continuar con Google'} onPress={signInWithGoogle} />
    </View>
  )
}

export default Index