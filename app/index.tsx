import { useAuth } from '@/hooks/auth/useAuth'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import { Button, View } from 'react-native'

WebBrowser.maybeCompleteAuthSession()


const Index = () => {
  const router = useRouter()
  const { signInWithGoogle } = useAuth();



  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title={'Continuar con Google'} onPress={signInWithGoogle} />
    </View>
  )
}

export default Index