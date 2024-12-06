import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, Redirect, router, Tabs } from 'expo-router';
import { Pressable, View, Appearance } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { FIREBASE_AUTH } from '@/FirebaseConfig';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  function changeTheme(): void {
    Appearance.setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  }

  const user = FIREBASE_AUTH.currentUser;

  // Jeśli nie ma użytkownika, przekieruj do logowania
  if (!user) {
    return <Redirect href="/pages/Login/login" />;
  }

  // Renderuj zakładki tylko dla zalogowanych
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: { height: 57 },
        headerShown: useClientOnlyValue(false, true),
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={changeTheme}>
              {({ pressed }) => (
                <Ionicons
                  name={colorScheme === 'dark' ? 'sunny' : 'moon'}
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pressable onPress={changeTheme}>
                {({ pressed }) => (
                  <Ionicons
                    name={colorScheme === 'dark' ? 'sunny' : 'moon'}
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
              <Link href="/modal" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      color={Colors[colorScheme ?? 'light'].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
              <Pressable onPress={() => {
                console.log('Sign out');
                FIREBASE_AUTH.signOut();
                router.push('/pages/Login/login');
              }}>
                {({ pressed }) => (
                  <FontAwesome name="sign-out" size={24} color={Colors[colorScheme ?? 'light'].text} style={{ marginRight: 15 }} />
                )}
              </Pressable>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Skaner NFC',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cellphone-nfc" size={35} color={color} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Twoje pojazdy',
          tabBarIcon: ({ color }) => <TabBarIcon name="car" color={color} />,
        }}
      />
    </Tabs>
  );
}