import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { ICar } from '@/constants/Interfaces/ICar';
import { CarFuelType } from '@/constants/Enums/CarFuelType';
import { CarTyreType } from '@/constants/Enums/CarTyreType';

interface CarItemProps {
    item: ICar;
    openFuelModal: (carId: number) => void;
    carOptions: (carId: number) => void;
    openInfoPage: (carId: number) => void;
}

const CarItem: React.FC<CarItemProps> = ({ item, openFuelModal, carOptions, openInfoPage }) => (
    <View style={styles.card}>
        <View style={styles.cardContent}>
            <Text style={styles.title}>
                [{item.id}] {item.brand} {item.model} ({item.year})
            </Text>
            <Text style={styles.subtitle}>VIN: {item.vin}</Text>
            <Text style={styles.subtitle}>Rejestracja: {item.numberPlate}</Text>
            <Text style={styles.subtitle}>Napęd: {CarFuelType[item.fuelType]}</Text>
            <Text style={styles.subtitle}>Rodzaj opon: {CarTyreType[item.wheelType]}</Text>
        </View>
        <TouchableOpacity style={styles.optionsButton} onPress={() => openInfoPage(item.id)}>
            <Text style={styles.optionsButtonText}>ℹ️</Text>
        </TouchableOpacity>
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

const styles = StyleSheet.create({
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
});

export default CarItem;