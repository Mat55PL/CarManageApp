import { StatusBar } from 'expo-status-bar';
import React, { useRef } from 'react';
import { Button, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { FIREBASE_APP, FIREBASE_AUTH, UpdateDisplayName } from '@/FirebaseConfig';
export default function ModalScreen() {
  const [displayName, setDisplayName] = React.useState<string | null>(null);

  var USER = FIREBASE_AUTH.currentUser;

  const setUserDisplayName = async () => {
    if (!displayName) {
      console.log('displayName is empty');
      return;
    }

    console.log(displayName);

    try {
      await UpdateDisplayName(displayName);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>Witaj, {USER?.email}</Text>
      <Text>USERID: {USER?.uid}</Text>
      <Text>displayName: {USER?.displayName}</Text>
      <Text style={styles.inputLabel}>Uzupełnij input label</Text>
      <TextInput style={styles.input} onChangeText={setDisplayName} placeholder='Twój DisplayName'></TextInput>
      <TouchableOpacity onPress={setUserDisplayName}>
        <Text>Ustaw DisplayName</Text>
      </TouchableOpacity>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
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
  inputLabel: {
    color: 'white',
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    backgroundColor: 'white',
  },
});
