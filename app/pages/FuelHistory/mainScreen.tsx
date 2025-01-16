import React, { useEffect, useState } from 'react';
import { Text, View } from "@/components/Themed";
import { StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import FuelTankModal from '@/app/modals/FuelTankModal';
import { IFuel } from '@/constants/Interfaces/IFuel';
import { AddFuelHistoryForCarId, DeleteFuelHistoryForCarId, GetAllFuelHistoryForCarId } from '@/app/services/API/apiFuelService';
import FuelItem from '@/components/Fuel/FuelItem';
import { FuelValidation } from '@/components/Fuel/FuelValidation';
import OptionsFuelTankModal from '@/app/modals/OptionsFuelTankModal';

export const screenOptions = {
    headerShown: true,
    title: 'Historia Tankowania',
};

const FuelHistoryScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const carId = params.carId ? Number(params.carId) : 0;
    const fuelType = params.CarFuelType ? Number(params.CarFuelType) : 0;
    const [fuelData, setFuelData] = useState<IFuel[]>([]);
    //fuel modal
    const [isFuelModalVisible, setIsFuelModalVisible] = useState(false);
    const [stationName, setStationName] = useState('');
    const [fuelAmount, setFuelAmount] = useState('');
    const [amountSpent, setAmountSpent] = useState('');
    const [odometer, setOdometer] = useState('');
    // fuel options modal
    const [isOptionsFuelModalVisible, setIsOptionsFuelModalVisible] = useState(false);
    const [selectedFuelHistoryId, setSelectedFuelHistoryId] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getData = async () => {
        try {
            const response = await GetAllFuelHistoryForCarId(carId);
            setFuelData(response);
            setLoading(false);
            console.log(`Fuel Data for [${carId}]:`, response);
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleBackButton = () => {
        console.log('Back button pressed');
        router.back();
    };

    const openFuelModal = () => {
        console.log('Opening fuel modal...');
        setIsFuelModalVisible(true);
    };

    const closeFuelModal = () => {
        setIsFuelModalVisible(false);
        setStationName('');
        setFuelAmount('');
        setAmountSpent('');
        setOdometer('');
    };

    const onRefresh = async () => {
        console.log('Refreshing data...');
        setRefreshing(true);
        await getData();
        setRefreshing(false);
    };

    const fuelModalAddFuel = () => {
        console.log('Adding fuel...');
        if (!(FuelValidation({
            carId: carId, date: new Date().toISOString(),
            fuelAmount: parseFloat(fuelAmount), cost: parseFloat(amountSpent),
            odometer: parseFloat(odometer), fuelType: fuelType, location: stationName, note: ''
        }).length > 0)) {
            AddFuelHistoryForCarId({
                carId: carId, date: new Date().toISOString(),
                fuelAmount: parseFloat(fuelAmount), cost: parseFloat(amountSpent),
                odometer: parseFloat(odometer), fuelType: fuelType, location: stationName, note: ''
            });
            setFuelData([...fuelData, {
                id: fuelData.length + 1,
                carId: carId,
                date: new Date().toISOString(),
                fuelAmount: parseFloat(fuelAmount),
                cost: parseFloat(amountSpent),
                odometer: parseFloat(odometer),
                fuelType: fuelType,
                location: stationName,
                note: ''
            }]);
            closeFuelModal();
        } else {
            console.log('Fuel data is invalid');
        }
    };

    const fuelOptions = () => {
        console.log('Fuel options...');
    };

    const openFuelOptionsModal = (fuelId: number) => {
        console.log('Opening fuel options modal...');
        setSelectedFuelHistoryId(fuelId);
        setIsOptionsFuelModalVisible(true);
    }

    const closeFuelOptionsModal = () => {
        console.log('Closing fuel options modal...');
        setIsOptionsFuelModalVisible(false);
    }

    const onDeleteFuelTank = async () => {
        console.log(`Deleting fuel tank [${selectedFuelHistoryId}]`);
        try {
            await DeleteFuelHistoryForCarId(selectedFuelHistoryId);
            setFuelData(fuelData.filter((item) => item.id !== selectedFuelHistoryId));
            Alert.alert('Sukces', 'Pomyślnie usunięto zapis tankowania', [{ text: 'OK' }]);
        } catch (error) {
            console.error(`Error deleting fuel tank [${selectedFuelHistoryId}]`, error);
            Alert.alert('Błąd! Sprawdź połączenie z internetem', 'Nie udało się usunąć zapisu tankowania', [{ text: 'OK' }]);
        }
        closeFuelOptionsModal();
    }

    const renderFuelHistoryItem = ({ item }: { item: IFuel }) => (
        <FuelItem item={item} openFuelOptions={openFuelOptionsModal} />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historia Tankowania dla Pojazdu ID: {carId}</Text>
            <FlatList
                data={fuelData}
                renderItem={renderFuelHistoryItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyComponent}>Brak danych do wyświetlenia</Text>
                )}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
            <FuelTankModal
                isVisible={isFuelModalVisible}
                onClose={closeFuelModal}
                stationName={stationName}
                setStationName={setStationName}
                fuelAmount={fuelAmount}
                setFuelAmount={setFuelAmount}
                amountSpent={amountSpent}
                setAmountSpent={setAmountSpent}
                odometer={odometer}
                setOdometer={setOdometer}
                onAddFuel={fuelModalAddFuel}
                selectedCar={undefined}
            />
            <OptionsFuelTankModal
                isVisible={isOptionsFuelModalVisible}
                onClose={closeFuelOptionsModal}
                selectedFuelHistoryId={selectedFuelHistoryId}
                onEditFuelTank={() => console.log('Edit fuel tank')}
                onDeleteFuelTank={onDeleteFuelTank}
            />
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.btnAddFuel} onPress={openFuelModal}>
                    <Text>⛽</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 20
    },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'transparent',
    },
    emptyComponent: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    btnBack: {
        padding: 16,
        backgroundColor: '#74bf63',
        borderRadius: 50,
        elevation: 4,
        marginRight: 10,
    },
    btnAddFuel: {
        padding: 16,
        backgroundColor: '#74bf63',
        borderRadius: 50,
        elevation: 4,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
});

export default FuelHistoryScreen;
