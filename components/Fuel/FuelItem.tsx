import React from "react";
import { IFuel } from "@/constants/Interfaces/IFuel";
import { View, Text } from "../Themed";
import { TouchableOpacity, StyleSheet } from "react-native";
import { getFuelType } from "@/constants/Enums/CarFuelType";

interface FuelItemProps {
    item: IFuel;
    openFuelOptions: (fuelId: number) => void;
}

const transformDate = (date: string) => {
    let dateObject = new Date(date);

    let onlyDate = dateObject.toLocaleDateString('pl-PL');
    let time = dateObject.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    let formattedDate = `${onlyDate} | ${time}`;
    return formattedDate;
};

const FuelItem: React.FC<FuelItemProps> = ({ item, openFuelOptions }) => (
    console.log('FuelItem:', item),
    <View style={styles.card}>
        <View style={styles.cardContent}>
            <Text style={styles.title}>
                [{item.id}] {transformDate(item.date)}
            </Text>
            <Text style={styles.subtitle}>Ilość: {item.fuelAmount} litrów</Text>
            <Text style={styles.subtitle}>Koszt: {item.cost} PLN</Text>
            <Text style={styles.subtitle}>Cena za litr: {(item.cost / item.fuelAmount).toFixed(2)} PLN</Text>
            <Text style={styles.subtitle}>Przebieg: {item.odometer} km</Text>
            <Text style={styles.subtitle}>Rodzaj paliwa: {getFuelType(item.fuelType)}</Text>
        </View>
        <TouchableOpacity style={styles.optionsButton} onPress={() => openFuelOptions(item.id)}>
            <Text style={styles.optionsButtonText}>⋮</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
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
});

export default FuelItem;