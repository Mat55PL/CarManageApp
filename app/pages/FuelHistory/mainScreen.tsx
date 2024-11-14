// app/FuelHistory/[carId].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import FuelTankModal from '@/app/modals/FuelTankModal';
import { IFuel } from '@/constants/Interfaces/IFuel';
import { GetAllFuelHistoryForCarId } from '@/app/services/API/apiFuelService';
import FuelItem from '@/components/Fuel/FuelItem';

const FuelHistoryScreen: React.FC = () => {
    const { carId } = useLocalSearchParams<{ carId: string }>();
    const [fuelData, setFuelData] = useState<IFuel[]>([]);
    //fuel modal
    const [isFuelModalVisible, setIsFuelModalVisible] = useState(false);
    const [stationName, setStationName] = useState('');
    const [fuelAmount, setFuelAmount] = useState('');
    const [amountSpent, setAmountSpent] = useState('');
    const [odometer, setOdometer] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getData = async () => {
        try {
            const response = await GetAllFuelHistoryForCarId(parseInt(carId));
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
        // TODO: Navigate back to the previous screen
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
    };

    const renderFuelHistoryItem = ({ item }: { item: IFuel }) => (
        <FuelItem item={item} />
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
        backgroundColor: '#fff',
        paddingTop: 50
    },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 20,
        right: 20,
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
