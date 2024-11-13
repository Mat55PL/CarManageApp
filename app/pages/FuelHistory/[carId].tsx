// app/FuelHistory/[carId].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';


const FuelHistoryScreen: React.FC = () => {
    const { carId } = useLocalSearchParams<{ carId: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const handleBackButton = () => {
        console.log('Back button pressed');
        // TODO: Navigate back to the previous screen
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historia Tankowania dla Pojazdu ID: {carId}</Text>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.btnBack} onPress={handleBackButton}>
                    <Text>↩️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnAddFuel} onPress={handleBackButton}>
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
        flexDirection: 'row',               // Ułożenie przycisków w poziomie
        alignItems: 'center',
        justifyContent: 'flex-end',         // Wyrównanie przycisków do prawej
        position: 'absolute',                // Pozycjonowanie absolutne
        bottom: 20,                           // Odstęp od dołu ekranu
        right: 20,                            // Odstęp od prawej strony ekranu
    },
    btnBack: {
        padding: 16,
        backgroundColor: '#74bf63',
        borderRadius: 50,
        elevation: 4,
        marginRight: 10,                      // Odstęp między przyciskami
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
