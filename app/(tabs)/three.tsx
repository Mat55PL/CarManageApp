import { Text, View } from "@/components/Themed";
import { FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Modal, TextInput, Platform } from "react-native";
import { useEffect, useState } from "react";

import CarItem from "@/components/Car/CarItem";
import FuelTankModal from "../modals/FuelTankModal";
import CreateCarModal from "../modals/CreateCarModal";
import { ICar } from "@/constants/Interfaces/ICar";
import { addCar, getAllCars } from "../services/API/apiService";
import { CarFuelType } from "@/constants/Enums/CarFuelType";
import { CarTyreType } from "@/constants/Enums/CarTyreType";
import { CarValidation } from "@/components/Car/CarValidation";


export default function TabThreeScreen() {
    const [carsData, setCarsData] = useState<ICar[]>([]);
    const [carNames, setCarNames] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false)
    const [isFuelModalVisible, setIsFuelModalVisible] = useState(false);
    const [isCreateCarModalVisible, setIsCreateCarModalVisible] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
    const [stationName, setStationName] = useState('');
    const [fuelAmount, setFuelAmount] = useState('');
    const [amountSpent, setAmountSpent] = useState('');
    const [odometer, setOdometer] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [vin, setVin] = useState('');
    const [productionYear, setProductionYear] = useState('');
    const [fuelType, setFuelType] = useState<number | null>(null);
    const [wheelType, setWheelType] = useState<number | null>(null);
    const [numberPlate, setNumberPlate] = useState('');


    const getData = async () => {
        try {
            const response = await getAllCars();
            setCarsData(response);
        } catch (error) {
            console.error(error);
            setError(`Wystąpił błąd podczas pobierania danych: ${error}`);
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
        openCreateCarModal();
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

    const openCreateCarModal = () => {
        setIsCreateCarModalVisible(true);
    };

    const closeCreateCarModal = () => {
        setIsCreateCarModalVisible(false);
    };

    const selectedCar = (!error) ? carsData.find((car) => car.id === selectedCarId) : undefined;

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

    const handleAddCar = () => {
        if (!(CarValidation({ brand, model, vin, year: parseInt(productionYear), fuelType: fuelType ?? 0, wheelType: wheelType ?? 0, numberPlate }).length > 0)) {
            addCar({
                brand: brand,
                model: model,
                vin: vin,
                year: parseInt(productionYear),
                fuelType: fuelType ?? 0,
                wheelType: wheelType ?? 0,
                numberPlate: numberPlate
            });
        } else {
            console.log('Validation failed');
            return;
        }
        // TODO: Implementacja logiki dodawania nowego pojazdu

        // Wyczyść pola formularza
        setBrand('');
        setModel('');
        setVin('');
        setProductionYear('');
        setFuelType(CarFuelType.Benzyna);
        setWheelType(CarTyreType.Letnie);
        setNumberPlate('');

        closeCreateCarModal();
    };


    const renderItem = ({ item }: { item: ICar }) => (
        <CarItem item={item} openFuelModal={openFuelModal} carOptions={carOptions}></CarItem>
    );

    return (
        <View style={styles.container}>
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Text>Sprawdź swoje połączenie z internetem... 😥</Text>
                </View>
            ) : null}
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
            <CreateCarModal
                isVisible={isCreateCarModalVisible}
                onClose={closeCreateCarModal}
                onAddCar={handleAddCar}
                brand={brand}
                setBrand={setBrand}
                model={model}
                setModel={setModel}
                vin={vin}
                setVin={setVin}
                productionYear={productionYear}
                setProductionYear={setProductionYear}
                fuelType={fuelType}
                setFuelType={setFuelType}
                wheelType={wheelType ?? 0}
                setWheelType={setWheelType}
                numberPlate={numberPlate}
                setNumberPlate={setNumberPlate}
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
    errorText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#294230',
        borderRadius: 5,
        marginVertical: 10,
    },
});