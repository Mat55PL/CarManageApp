import { Text, View } from "@/components/Themed";
import { Car } from "@/app/(tabs)/index";
import { FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getAllCars } from "../API/apiService";
import { CarFuelType } from "@/constants/Enums/CarFuelType";
import { CarTyreType } from "@/constants/Enums/CarTyreType";

export default function TabThreeScreen() {
    const [carsData, setCarsData] = useState<Car[]>([]);
    const [refreshing, setRefreshing] = useState(false)

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
            <TouchableOpacity style={styles.optionsButton}>
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
});