import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { Button, Platform, StyleSheet } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import BottomSheet, { BottomSheetMethods } from '@devvie/bottom-sheet';
import { Select, SelectModalContext, SelectModalProvider, SelectProvider } from '@mobile-reality/react-native-select-pro';
export default function ModalScreen() {
  const sheetRef = useRef<BottomSheetMethods>(null);

  const data = [
    { label: 'Audi', value: 'audi' },
    { label: 'BMW', value: 'bmw' },
    { label: 'Opel', value: 'opel' },
    { label: 'Volkswagen', value: 'volkswagen' },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/modal.tsx" />
      <SelectProvider>
        <Select options={data} searchable={true} />
      </SelectProvider>
      <Button title="Open" onPress={() => sheetRef.current?.open()} />
      <BottomSheet animationType={'spring'} ref={sheetRef}>
        <Text style={styles.SheetTitle}>
          The smart 😎, tiny 📦, and flexible 🎗 bottom sheet your app craves 🚀
        </Text>
        <SelectProvider>
          <Select options={data} />
        </SelectProvider>
      </BottomSheet>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  SheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  }
});
