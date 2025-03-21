import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import {
  AppState,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView
} from 'react-native';
import { SetStateAction, useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import FuelTankModal from '../modals/FuelTankModal';
import { updateCurrentCarUser } from '../services/API/apiService';
import { FIREBASE_AUTH } from '@/FirebaseConfig';

type TagType = 'fuel' | 'service' | 'setCurrentCarUser' | null;

export default function TabTwoScreen() {
  const [hasNfc, setHasNfc] = useState<boolean | null>(null);
  const [nfcActive, setNfcActive] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [appState, setAppState] = useState<string>(AppState.currentState);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<TagType>(null);
  const [vehicleId, setVehicleId] = useState<string>('');
  const [error, setError] = useState<string>('');

  let USER = FIREBASE_AUTH.currentUser;

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

  const handleSaveTag = async () => {
    if (!vehicleId) {
      setError('Proszę wprowadzić ID pojazdu');
      return;
    }
    if (!selectedType) {
      setError('Proszę wybrać typ tagu');
      return;
    }

    // Ustawiamy "tryb skanowania" na true -> pokaże się overlay
    setIsScanning(true);

    const tagData = {
      vehicleId,
      type: selectedType,
      timestamp: new Date().toISOString()
    };

    try {
      // Próba zapisu do tagu
      await saveDataToTag(tagData);

      // Po pomyślnym zapisie zamykamy modal i czyścimy stany
      Alert.alert('Sukces', `Tag został zapisany dla pojazdu ${tagData.vehicleId} jako ${tagData.type}`);
    } catch (error) {
      console.error('Error saving tag:', error);
      Alert.alert('Błąd', 'Nie udało się zapisać tagu');
    } finally {
      // Niezależnie od wyniku, kończymy tryb skanowania
      setIsScanning(false);

      // Czyścimy dane formularza
      setShowModal(false);
      setSelectedType(null);
      setVehicleId('');
      setError('');
    }
  };

  const saveDataToTag = async (data: any) => {
    const message = [
      Ndef.textRecord(JSON.stringify(data)),
    ];

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage(message);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        Alert.alert('Sukces', `Tag został zapisany dla pojazdu ${data.vehicleId} jako ${data.type}`);
      }
    } finally {
      await NfcManager.cancelTechnologyRequest();
    }
  };

  const readTag = async () => {
    setIsScanning(true);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (tag?.ndefMessage?.[0]) {
        const ndefMessage = tag.ndefMessage[0];
        const tagData = JSON.parse(Ndef.text.decodePayload(new Uint8Array(ndefMessage.payload)));
        await processNfcTag(tagData);
        console.log('Odczytano Tag data:', tagData);
        /*
        Alert.alert(
          'Odczytano tag',
          `Typ: ${tagData.type}\nPojazd ID: ${tagData.vehicleId}\nData: ${new Date(tagData.timestamp).toLocaleString()}`
        );
        */
      }
    } catch (ex) {
      console.warn('Error reading tag:', ex);
      Alert.alert('Błąd', 'Nie udało się odczytać tagu');
    } finally {
      await NfcManager.cancelTechnologyRequest();
      setIsScanning(false);
    }
  };

  const setNewUser = async (tagData: any) => {
    console.log('[setNewUser] Tag data:', tagData);
    try {
      if (USER) {
        await updateCurrentCarUser(tagData.vehicleId, USER.uid);
      } else {
        console.error('User is not authenticated');
        Alert.alert('Błąd', 'Użytkownik nie jest zalogowany');
      }
      Alert.alert('Sukces', 'Pojazd został przypisany do Ciebie');
    }
    catch (error) {
      console.error('Error setting new user:', error);
      Alert.alert('Błąd', 'Nie udało się przypisać pojazdu');
    }
  };

  const processNfcTag = async (tagData: any) => {
    console.log('[processNFCTAG] Tag data:', tagData);
    if (tagData.type === 'fuel') {
      console.log('Fuel tag detected');
      // Open fuel tank modal
    } else if (tagData.type === 'service') {
      console.log('Service tag detected');
      // Open service modal
    } else if (tagData.type === 'setCurrentCarUser') {
      console.log('Set current car user tag detected');
      // alert czy na pewno chcesz przypisać pojazd do siebie?
      Alert.alert(
        'Przejęcie pojazdu', 'Czy na pewno chcesz przypisać ten pojazd do siebie?',
        [{ text: 'Tak', onPress: () => setNewUser(tagData) },
        { text: 'Nie', onPress: () => console.log('Anulowano przypisanie pojazdu') }
        ]
      );
    }
  };

  if (hasNfc === null) return null;
  if (!hasNfc) return <ErrorView message="Nie wykryto modułu NFC!" />;
  if (!nfcActive) return <ErrorView message="Moduł NFC jest wyłączony!" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zarządzanie NFC</Text>
      <View style={styles.separator} />

      <SafeAreaView style={styles.content}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.buttonText}>Zapisz nowy tag</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={readTag}
        >
          <Text style={styles.buttonText}>Odczytaj tag</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nowy tag NFC</Text>

            <TextInput
              style={styles.input}
              placeholder="ID pojazdu"
              value={vehicleId}
              onChangeText={setVehicleId}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Wybierz typ tagu:</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === 'fuel' && styles.typeButtonSelected
                ]}
                onPress={() => setSelectedType('fuel')}
              >
                <Text style={styles.typeButtonText}>Tankowanie</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === 'service' && styles.typeButtonSelected
                ]}
                onPress={() => setSelectedType('service')}
              >
                <Text style={styles.typeButtonText}>Serwis</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === 'setCurrentCarUser' && styles.typeButtonSelected
                ]}
                onPress={() => setSelectedType('setCurrentCarUser')}
              >
                <Text style={styles.typeButtonText}>Przejęcie pojazdu</Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setShowModal(false);
                  setError('');
                  setSelectedType(null);
                  setVehicleId('');
                }}
              >
                <Text style={styles.buttonText}>Anuluj</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={handleSaveTag}
              >
                <Text style={styles.buttonText}>Zapisz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {isScanning && (
        <View style={styles.overlay}>
          <View style={styles.scanningPanel}>
            <Text style={styles.scanningText}>Przyłóż tag NFC...</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={() => {
                NfcManager.cancelTechnologyRequest();
                setIsScanning(false);
              }}
            >
              <Text style={styles.buttonText}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <FuelTankModal
        isVisible={false}
        onClose={() => { }}
        onAddFuel={() => { }}
        stationName='Orlen' setStationName={function (text: string): void {
          throw new Error('Function not implemented.');
        }} fuelAmount={''} setFuelAmount={function (text: string): void {
          throw new Error('Function not implemented.');
        }} amountSpent={''} setAmountSpent={function (text: string): void {
          throw new Error('Function not implemented.');
        }} odometer={''} setOdometer={function (text: string): void {
          throw new Error('Function not implemented.');
        }} selectedCar={undefined} />
    </View>
  );
}

const ErrorView = ({ message }: { message: string }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ddd',
    marginTop: 20,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '90%',
    backgroundColor: '#ddd',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPrimary: {
    backgroundColor: '#2196F3',
  },
  buttonSecondary: {
    backgroundColor: '#4CAF50',
  },
  buttonCancel: {
    backgroundColor: '#f44336',
    flex: 1,
    marginRight: 8,
  },
  buttonConfirm: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginLeft: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningPanel: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  typeButtons: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  typeButton: {
    flexGrow: 1,
    flexBasis: '30%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 5,
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  typeButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  sectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  NfcErrorText: {
    color: '#f44336',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#f44336',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
});