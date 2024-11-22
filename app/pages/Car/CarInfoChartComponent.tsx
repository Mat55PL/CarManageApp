import { BarChart, LineChart } from 'react-native-gifted-charts';
import React, { useState } from 'react';
import { Text, View } from "@/components/Themed";
import { ScrollView } from "react-native";

const barData = [
    { value: 50, label: 'Styczeń' },
    { value: 10, label: 'Luty' },
    { value: 40, label: 'Marzec', frontColor: 'red' },
    { value: 95, label: 'Kwiecień' },
    { value: 85, label: 'Maj' },
    { value: 91, label: 'Czerwiec' }
];

const lineData = [
    { value: 500, label: 'Styczeń' },
    { value: 1110, label: 'Luty' },
    { value: 1400, label: 'Marzec' },
    { value: 1755, label: 'Kwiecień' },
    { value: 1998, label: 'Maj' },
    { value: 2011, label: 'Czerwiec' }
];

export const renderChart = (activeChart: string) => {
    switch (activeChart) {
        case 'przebieg':
            return (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                    }}
                >
                    <LineChart
                        data={lineData}
                        width={300}
                        height={200}
                        color1='#4169e1'
                        yAxisThickness={0}
                        xAxisThickness={1}
                        noOfSections={3}
                        isAnimated={true}
                        pointerConfig={{
                            pointerStripUptoDataPoint: true,
                            pointerLabelComponent: (items: { value: number, label: string }[]) => {
                                return (
                                    <View
                                        style={{
                                            height: 75,
                                            width: 100,
                                            backgroundColor: '#282C3E',
                                            borderRadius: 4,
                                            justifyContent: 'center',
                                            padding: 10,
                                        }}>
                                        <Text style={{ color: 'lightgray', fontSize: 12 }}>
                                            Przebieg z {items[0].label}
                                        </Text>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{items[0].value}</Text>
                                    </View>
                                );
                            },
                        }}
                    />
                </ScrollView>
            );
        case 'spalanie':
            return (
                <BarChart
                    data={barData.map(item => ({ ...item, frontColor: '#2ecc71' }))}
                    width={300}
                    height={200}
                    barWidth={22}
                    spacing={20}
                    yAxisThickness={0}
                    xAxisThickness={1}
                    noOfSections={3}
                />
            );
        case 'koszty':
            return (
                <BarChart
                    data={barData.map(item => ({ ...item, frontColor: '#e74c3c' }))}
                    width={300}
                    height={200}
                    barWidth={22}
                    spacing={20}
                    yAxisThickness={0}
                    xAxisThickness={1}
                    noOfSections={3}
                />
            );
    }
};

