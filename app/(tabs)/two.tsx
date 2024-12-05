import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { AppState, StyleSheet, Image, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { SetStateAction, useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';


export default function TabTwoScreen() {

  const [hasNfc, setHasNfc] = useState<boolean | null>(null); // is device has NFC supported
  const [nfcActive, setNfcActive] = useState<boolean>(false); // is NFC enabled on device
  const [isScanning, setIsScanning] = useState<boolean>(false); // is NFC scanning in progress
  const [appState, setAppState] = useState<string>(AppState.currentState);

  const checkIsNfcActive = async () => {
    try {
      const nfcEnabled = await NfcManager.isEnabled();
      console.log(`NFC is enabled: ${nfcEnabled}`);
      if (nfcEnabled) {
        setNfcActive(true);
      } else {
        console.log(`NFC is not enabled`);
        setNfcActive(false);
      }
    } catch (error) {
      console.error(`[checkIsNfcActive] Error checking NFC status: ${error}`);
      setNfcActive(false);
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: SetStateAction<string>) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkIsNfcActive();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    const checkIsNfcSupported = async () => {
      try {
        const deviceIsNfcSupported = await NfcManager.isSupported();
        // If the result is null or undefined, treat it as NFC not supported
        if (deviceIsNfcSupported == null || deviceIsNfcSupported == false) {
          setHasNfc(false);
          console.warn('NFC support check returned null or undefined.');
        } else {
          setHasNfc(deviceIsNfcSupported);

          if (deviceIsNfcSupported) {
            await NfcManager.start();
          }
        }
      } catch (error) {
        console.error('Error checking NFC support:', error);
        setHasNfc(false);
      }
    };

    checkIsNfcSupported();
  }, []);

  useEffect(() => {
    checkIsNfcActive();
  }, []);




  if (hasNfc === null) return null;

  if (!hasNfc) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.NfcErrorText}>Nie wykryto modułu NFC!</Text>
      </View>
    );
  }

  if (!nfcActive) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.NfcErrorText}>Moduł NFC jest wyłączony!</Text>
      </View>
    );
  }

  const readTag = async () => {
    console.log('Trying to read tag');
    setIsScanning(true);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (tag) {
        console.log(`Tag data: ${JSON.stringify(tag)}`);
        Alert.alert('Tag Data', JSON.stringify(tag));
      } else {
        console.warn('No tag detected');
        Alert.alert('Error', 'No tag detected.');
      }
    } catch (ex) {
      console.warn('Error reading tag', ex);
    } finally {
      try {
        await NfcManager.cancelTechnologyRequest();
      } catch (error) {
        console.warn('Error cancelling technology request', error);
      }
      setIsScanning(false);
    }
  };

  const cancelReadTag = async () => {
    try {
      await NfcManager.cancelTechnologyRequest();
      console.log('Tag read cancelled');
    } catch (error) {
      console.error('Error cancelling tag read:', error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} />
      <Text style={styles.nfc_title}>NFC</Text>
      <SafeAreaView style={styles.sectionContainer}>
        <Text>Hello world</Text>
        <TouchableOpacity style={[styles.btn, styles.btnScan]} onPress={readTag}>
          <Text style={{ color: 'white' }}>Scan Tag</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {isScanning && (
        <View style={styles.overlay}>
          <View style={styles.scanningPanel}>
            <Text style={styles.scanningText}>Trwa wyszukiwanie tagu NFC...</Text>
            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={cancelReadTag}>
              <Text style={{ color: 'white' }}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  NfcErrorText: {
    color: 'red',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
  },
  nfc_title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  btn: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  btnScan: {
    backgroundColor: 'green',
  },
  btnCancel: {
    backgroundColor: 'red',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningPanel: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    opacity: 0.6,
  },
  scanningText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
  },
});
