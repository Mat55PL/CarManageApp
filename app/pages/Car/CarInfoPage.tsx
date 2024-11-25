import React, { useState } from 'react';
import { Text, View } from "@/components/Themed";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { CarFuelType, getFuelType } from '@/constants/Enums/CarFuelType';
import { CarTyreType, getTyreTypeName } from '@/constants/Enums/CarTyreType';
import { SelectProvider, Select } from '@mobile-reality/react-native-select-pro';
import { renderChart } from './CarInfoChartComponent';


const CarInfoScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const car = params.car && JSON.parse(params.car as string);
    const [activeChart, setActiveChart] = useState<'przebieg' | 'spalanie' | 'koszty'>('przebieg');
    const [editingField, setEditingField] = useState<any>(null);

    const testSelectData = [
        { label: 'Benzyna', value: 'Benzyna' },
        { label: 'Diesel', value: 'Diesel' },
        { label: 'LPG', value: 'LPG' },
        { label: 'Elektryczny', value: 'Elektryczny' },
        { label: 'Hybryda', value: 'Hybryda' },
    ];

    const handleEditItem = (item: any) => {
        if (editingField === item.label) {
            const options = item.label === 'Opony'
                ? Object.keys(CarTyreType).map(tyreType => ({ label: tyreType, value: tyreType }))
                : Object.keys(CarFuelType).map(fuelType => ({ label: fuelType, value: fuelType }));

            return (
                <View style={styles.editItemsContainer}>
                    <Select
                        options={options}
                        placeholderText='Wybierz'
                        searchable={false}
                        noOptionsText='Brak wyników'
                    />
                    <TouchableOpacity onPress={() => setEditingField(null)}>
                        <Text>✅</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return <Text style={styles.infoValue}>{item.value}</Text>;
    };

    const chartButtons = [
        { label: 'Przebieg', type: 'przebieg' },
        { label: 'Spalanie', type: 'spalanie' },
        { label: 'Koszty', type: 'koszty' }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.headerContent}>
                <Text style={styles.carTitle}>{car.brand} {car.model}</Text>
            </View>

            <View style={styles.carInfoContainer}>
                <View style={styles.infoGrid}>
                    {[
                        { label: 'VIN', value: car.vin },
                        { label: 'Rok produkcji', value: car.year },
                        { label: 'Numer rej.', value: car.numberPlate },
                        { label: 'Paliwo', value: getFuelType(car.fuelType), canBeEdited: true },
                        { label: 'Opony', value: getTyreTypeName(car.wheelType), canBeEdited: true },
                    ].map((item, index) => (
                        <View key={index} style={styles.infoCard}>
                            <SelectProvider>
                                <View style={styles.infoCardText}>
                                    <Text style={styles.infoLabel}>{item.label}</Text>
                                    {handleEditItem(item)}
                                </View>
                                {item.canBeEdited && (
                                    <TouchableOpacity style={{ marginTop: 15 }} onPress={() => setEditingField(item.label)}>
                                        <Text style={{ color: '#4169e1', fontWeight: '600' }}>✏️</Text>
                                    </TouchableOpacity>
                                )}
                            </SelectProvider>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.carChartsContainer}>
                <View style={styles.chartButtonsContainer}>
                    {chartButtons.map((button) => (
                        <TouchableOpacity
                            key={button.type}
                            style={[
                                styles.chartButton,
                                activeChart === button.type && styles.activeChartButton
                            ]}
                            onPress={() => setActiveChart(button.type as any)}
                        >
                            <Text style={[
                                styles.chartButtonText,
                                activeChart === button.type && styles.activeChartButtonText
                            ]}>{button.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <ScrollView
                    contentContainerStyle={styles.chartContainer}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {renderChart(activeChart)}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContent: {
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 40,
    },
    carTitle: {
        color: 'white',
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    carInfoContainer: {
        marginTop: -40,
        paddingHorizontal: 20,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    infoCard: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoCardText: {
        backgroundColor: 'transparent',
        width: '90%',
    },
    infoLabel: {
        fontSize: 14,
        color: '#7a8ca3',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 16,
        color: '#2c3e50',
        fontWeight: '600',
    },
    carChartsContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 20,
        marginTop: 20,
        elevation: 10,
    },
    chartButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },
    chartButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: '#f1f2f6',
    },
    activeChartButton: {
        backgroundColor: '#4169e1',
    },
    chartButtonText: {
        color: '#2c3e50',
        fontWeight: '500',
    },
    activeChartButtonText: {
        color: 'white',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    editItemsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
});

export default CarInfoScreen;