import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import { ICar } from "@/constants/Interfaces/ICar";
import { Select } from "@mobile-reality/react-native-select-pro";

interface FuelModalProps {
    isVisible: boolean;
    onClose: () => void;
    onAddFuel: () => void;
    stationName: string;
    setStationName: (text: string) => void;
    fuelAmount: string;
    setFuelAmount: (text: string) => void;
    amountSpent: string;
    setAmountSpent: (text: string) => void;
    odometer: string;
    setOdometer: (text: string) => void;
    selectedCar: ICar | undefined;
}

const FuelTankModal: React.FC<FuelModalProps> = ({
    isVisible, onClose, onAddFuel, stationName, setStationName, fuelAmount,
    setFuelAmount, amountSpent, setAmountSpent, odometer, setOdometer, selectedCar
}) => (
    <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
    >
        <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Dodaj tankowanie</Text>
                    {selectedCar && <Text style={styles.subtitle}>Dla pojazdu: {selectedCar?.brand} {selectedCar?.model} ({selectedCar?.numberPlate})</Text>}
                    <TextInput
                        style={styles.input}
                        placeholder="Nazwa stacji"
                        value={stationName}
                        onChangeText={setStationName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Ilość paliwa (litry)"
                        value={fuelAmount}
                        onChangeText={setFuelAmount}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Kwota wydana (PLN)"
                        value={amountSpent}
                        onChangeText={setAmountSpent}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Przebieg (km)"
                        value={odometer}
                        onChangeText={setOdometer}
                        keyboardType="numeric"
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.modalButton} onPress={onAddFuel}>
                            <Text style={styles.modalButtonText}>Dodaj</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonCancel]}
                            onPress={onClose}
                        >
                            <Text style={styles.modalButtonText}>Anuluj</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalTitle: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#74bf63',
        borderRadius: 8,
        marginLeft: 8,
    },
    modalButtonCancel: {
        backgroundColor: '#ccc',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#666',
        marginBottom: 16,
    },
});

export default FuelTankModal;