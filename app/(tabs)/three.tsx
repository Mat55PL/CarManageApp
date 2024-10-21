import { Text, View } from "@/components/Themed";
import { FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Modal, TextInput, Platform } from "react-native";
import { useEffect, useState } from "react";

import CarItem from "@/components/Car/CarItem";
import FuelTankModal from "../modals/FuelTankModal";
import { Car } from "@/constants/Interfaces/Car";
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
    const [odometer, setOdometer] = useState('');

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
        <CarItem item={item} openFuelModal={openFuelModal} carOptions={carOptions}></CarItem>
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
            <FuelTankModal
                isVisible={isFuelModalVisible}
                onClose={closeFuelModal}
                onAddFuel={handleAddFuel}
                stationName={stationName}
                setStationName={setStationName}
                fuelAmount={fuelAmount}
                setFuelAmount={setFuelAmount}
                amountSpent={amountSpent}
                setAmountSpent={setAmountSpent}
                odometer={odometer}
                setOdometer={setOdometer}
                selectedCar={selectedCar}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
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
});