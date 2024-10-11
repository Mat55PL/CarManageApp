import { Text, View } from "@/components/Themed";
import { Car } from "@/app/(tabs)/index";
import { FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Modal, TextInput, Platform } from "react-native";
import { useEffect, useState } from "react";
import { getAllCars } from "../API/apiService";
import { CarFuelType } from "@/constants/Enums/CarFuelType";
import { CarTyreType } from "@/constants/Enums/CarTyreType";

export default function TabThreeScreen() {
    const [carsData, setCarsData] = useState<Car[]>([]);
    const [refreshing, setRefreshing] = useState(false)

    const [isFuelModalVisible, setIsFuelModalVisible] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
    const [stationName, setStationName] = useState('');
    const [fuelAmount, setFuelAmount] = useState('');
    const [amountSpent, setAmountSpent] = useState('');

    const getData = async () => {
        try {
            const response = await getAllCars();
            setCarsData(response);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const onRefresh = async () => {
        console.log('Refreshing data...');
        setRefreshing(true);
        await getData();
        setRefreshing(false);
    };

    const createNewCar = () => {
        console.log('Creating new car...');
    };

    const carOptions = (carId: number) => {
        console.log(`Options for car with ID: ${carId}`);
    };

    const openFuelModal = (carId: number) => {
        setSelectedCarId(carId);
        setIsFuelModalVisible(true);
    };

    const closeFuelModal = () => {
        setIsFuelModalVisible(false);
        setStationName('');
        setFuelAmount('');
        setAmountSpent('');
    };

    const selectedCar = carsData.find((car) => car.id === selectedCarId);

    const handleAddFuel = () => {
        // Logika dodawania wpisu tankowania
        console.log('Adding fuel record for car ID:', selectedCarId);
        console.log('Station Name:', stationName);
        console.log('Fuel Amount:', fuelAmount);
        console.log('Amount Spent:', amountSpent);

        // Wyczyść pola formularza
        setStationName('');
        setFuelAmount('');
        setAmountSpent('');

        // Zamknij modal
        closeFuelModal();
    };

    const renderItem = ({ item }: { item: Car }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.title}>
                    {item.brand} {item.model} ({item.year})
                </Text>
                <Text style={styles.subtitle}>VIN: {item.vin}</Text>
                <Text style={styles.subtitle}>Rejestracja: {item.numberPlate}</Text>
                <Text style={styles.subtitle}>Napęd: {CarFuelType[item.fuelType]}</Text>
                <Text style={styles.subtitle}>Rodzaj opon: {CarTyreType[item.wheelType]}</Text>
            </View>
            <TouchableOpacity style={styles.optionsButton} onPress={() => openFuelModal(item.id)}>
                <Text style={styles.optionsButtonText}>⛽</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionsButton}>
                <Text style={styles.optionsButtonText}>🔧</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionsButton} onPress={() => carOptions(item.id)}>
                <Text style={styles.optionsButtonText}>⋮</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <View style={styles.container}>
            <FlatList
                data={carsData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
            <TouchableOpacity style={styles.addButton} onPress={createNewCar}>
                <Text>➕</Text>
            </TouchableOpacity>
            <Modal
                visible={isFuelModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeFuelModal}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Dodaj tankowanie</Text>
                            <Text style={styles.subtitle}>Dla samochodu: {selectedCar?.brand} {selectedCar?.model} ({selectedCar?.numberPlate})</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nazwa stacji"
                                value={stationName}
                                onChangeText={setStationName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Ilość paliwa (litry)"
                                value={fuelAmount}
                                onChangeText={setFuelAmount}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Kwota wydana (PLN)"
                                value={amountSpent}
                                onChangeText={setAmountSpent}
                                keyboardType="numeric"
                            />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.modalButton} onPress={handleAddFuel}>
                                    <Text style={styles.modalButtonText}>Dodaj</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalButtonCancel]}
                                    onPress={closeFuelModal}
                                >
                                    <Text style={styles.modalButtonText}>Anuluj</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2, // Dodaje delikatny cień dla Androida
        opacity: 0.9,
    },
    cardContent: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    optionsButton: {
        padding: 8,
    },
    optionsButtonText: {
        fontSize: 24,
        color: '#666',
    },
    addButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#74bf63',
        borderRadius: 50,
        padding: 16,
        elevation: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalTitle: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#74bf63',
        borderRadius: 8,
        marginLeft: 8,
    },
    modalButtonCancel: {
        backgroundColor: '#ccc',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});