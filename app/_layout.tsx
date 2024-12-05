import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <Slot />;
  }

  const currentTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={currentTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name='pages/FuelHistory/mainScreen'
          options={({ route }) => ({
            headerShown: true,
            presentation: "transparentModal",
            title: `Historia tankowania [${route.params?.carId || ''}]`
          })}
        />
        <Stack.Screen
          name='pages/Car/CarInfoPage'
          options={{
            headerShown: true,
            title: `Informacje o pojeździe`
          }}
        />
        <Stack.Screen
          name='pages/Login/login'
          options={{ headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}

/*
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name='pages/FuelHistory/mainScreen' options={({ route, navigation }) => ({ headerShown: true, presentation: "transparentModal", title: `Historia tankowania [${route.params.carId}]` })} />
        <Stack.Screen name='pages/Car/CarInfoPage' options={({ route, navigation }) => ({ headerShown: true, title: `Informacje o pojeździe` })} />
      </Stack>
    </ThemeProvider>
  );
}

function LoginLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='pages/Login/login' options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
*/