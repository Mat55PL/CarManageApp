import { Text, View } from "@/components/Themed";
import { FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';

import CarItem from "@/components/Car/CarItem";
import FuelTankModal from "../modals/FuelTankModal";
import CreateCarModal from "../modals/CreateCarModal";
import { ICar } from "@/constants/Interfaces/ICar";
import { addCar, deleteCar, getAllCars } from "../services/API/apiService";
import { CarFuelType } from "@/constants/Enums/CarFuelType";
import { CarTyreType } from "@/constants/Enums/CarTyreType";
import { CarValidation } from "@/components/Car/CarValidation";
import CarOptionsModal from "../modals/CarOptionsModal";


export default function TabThreeScreen() {
    const [carsData, setCarsData] = useState<ICar[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false)
    const [isFuelModalVisible, setIsFuelModalVisible] = useState(false);
    const [isCreateCarModalVisible, setIsCreateCarModalVisible] = useState(false);
    const [isCarOptionsModalVisible, setIsCarOptionsModalVisible] = useState(false);
    const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
    //fuel modal
    const [stationName, setStationName] = useState('');
    const [fuelAmount, setFuelAmount] = useState('');
    const [amountSpent, setAmountSpent] = useState('');
    const [odometer, setOdometer] = useState('');
    //create car modal
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [vin, setVin] = useState('');
    const [productionYear, setProductionYear] = useState('');
    const [fuelType, setFuelType] = useState<number | null>(null);
    const [wheelType, setWheelType] = useState<number | null>(null);
    const [numberPlate, setNumberPlate] = useState('');

    const router = useRouter();

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
        openCarOptionsModal(carId);
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

    const closeCarOptionsModal = () => {
        setIsCarOptionsModalVisible(false);
    }

    const openCarOptionsModal = (carId: number) => {
        setSelectedCarId(carId);
        setIsCarOptionsModalVisible(true);
    }

    const selectedCar = (!error && carsData) ? carsData.find((car) => car.id === selectedCarId) : undefined;

    const handleAddFuel = () => {
        console.log('Adding fuel record for car ID:', selectedCarId);
        console.log('Station Name:', stationName);
        console.log('Fuel Amount:', fuelAmount);
        console.log('Amount Spent:', amountSpent);

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

        setBrand('');
        setModel('');
        setVin('');
        setProductionYear('');
        setFuelType(CarFuelType.Benzyna);
        setWheelType(CarTyreType.Letnie);
        setNumberPlate('');

        closeCreateCarModal();
    };

    const handleDeleteCar = async () => {
        console.log('Deleting car with ID:', selectedCarId);
        if (selectedCarId !== null) {
            Alert.alert('Usunięcie pojazdu', 'Czy na pewno chcesz usunąć ten pojazd?', [
                {
                    text: 'Tak',
                    onPress: async () => {
                        await deleteCar(selectedCarId);
                        console.log(`Car with ID: ${selectedCarId} has been deleted`);
                        await getData();
                        closeCarOptionsModal();
                    },
                },
                {
                    text: 'Nie',
                    onPress: () => {
                        console.log('Car deletion canceled');
                        //closeCarOptionsModal();
                    },
                },
            ]);
        }
        else {
            console.error('Selected car ID is null');
        }
    };

    const handleEditCar = () => {
        console.log('Editing car with ID:', selectedCarId);
    }

    const handleFuelHistory = () => {
        console.log('Fuel history for car with ID:', selectedCarId);
        if (selectedCarId !== null) {
            router.push({
                pathname: '/pages/FuelHistory/mainScreen',
                params: {
                    carId: selectedCar ? selectedCar.id.toString() : '',
                    CarFuelType: selectedCar ? selectedCar.fuelType : 0
                },
            });

            closeCarOptionsModal();
        } else {
            console.error('Selected car ID is null');
        }
    }

    const openInfoPage = (carId: number) => {
        console.log(`Info page for car with ID: ${carId}`);
        if (carId !== null) {
            router.push({
                pathname: '/pages/Car/CarInfoPage',
                params: {
                    car: JSON.stringify(carsData.find((car) => car.id === carId)),
                },
            });
        };
    }

    const openMaintenanceInfoPage = (carId: number) => {
        console.log(`Maintenance info page for car with ID: ${carId}`);
        if (carId !== null) {
            router.push({
                pathname: '/pages/Maintenance/maintenenceInfoScreen',
                params: {
                    carId: carId.toString(),
                },
            });
        };
    }

    const renderItem = ({ item }: { item: ICar }) => (
        <CarItem item={item} openFuelModal={openFuelModal} carOptions={carOptions}
            openInfoPage={openInfoPage} openMaintenanceInfoPage={openMaintenanceInfoPage} />
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
                ListEmptyComponent={<Text style={styles.emptyComponent}>
                    Brak pojazdów do wyświetlenia lub wystąpił błąd połączenia 🥹</Text>
                }
            />
            <TouchableOpacity style={styles.addButton} onPress={createNewCar}>
                <FontAwesome name="plus" size={22} color="#6e6e6e" />
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
            <CarOptionsModal
                isVisible={isCarOptionsModalVisible}
                onClose={closeCarOptionsModal}
                selectedCar={selectedCar ?? null}
                onDeleteCar={handleDeleteCar}
                onEditCar={handleEditCar}
                onFuelHistory={handleFuelHistory}
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
    emptyComponent: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
});