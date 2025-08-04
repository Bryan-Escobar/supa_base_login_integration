import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Listener para deep links
    const handleDeepLink = (url: string) => {
      console.log('🔗 Deep link recibido:', url);

      // Verificar si es un callback de OAuth
      if (url.includes('auth/callback') || url.includes('access_token=') || url.includes('code=')) {
        console.log('🚀 Navegando a auth/callback...');
        // Pasar la URL como parámetro al callback
        const encodedUrl = encodeURIComponent(url);
        router.push(`/auth/callback?callbackUrl=${encodedUrl}`);
      }
    };

    // Listener para cuando la app está abierta
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Verificar si hay un deep link inicial
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('🔗 Deep link inicial:', url);
        handleDeepLink(url);
      }
    });

    return () => subscription?.remove();
  }, [router]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
