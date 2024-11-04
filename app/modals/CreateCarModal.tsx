import React from "react";
import { Text, Modal, View, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Select, SelectModalProvider, SelectProvider } from '@mobile-reality/react-native-select-pro';
import { ICar } from "@/constants/Interfaces/ICar";
import { ICreateCarModalProps } from "@/constants/Interfaces/ICreateCarModalProps";
import { getCarsBrands, getCarsModels } from "../services/Files/fileSystem";

const CreateCarModal: React.FC<ICreateCarModalProps> = ({
    isVisible, onClose, onAddCar, brand, setBrand, model, setModel, vin, setVin,
    productionYear, setProductionYear, fuelType, setFuelType, wheelType, setWheelType,
    numberPlate, setNumberPlate
}) => (
    <SelectProvider>
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <SelectModalProvider>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Dodaj nowy pojazd</Text>
                            <Text style={styles.subtitle}>Marka</Text>
                            <Select
                                options={getCarsBrands().map(brand => ({ label: brand, value: brand }))} searchable={true} placeholderText="Wybierz pojazd z listy..."
                                onSelect={(option) => {
                                    setBrand(option.value);
                                    setModel('');
                                }} />
                            <Text style={styles.subtitle}>Model</Text>
                            <Select options={brand ? getCarsModels(brand).map(model => ({ label: model, value: model })) : []}
                                key={brand}
                                searchable={true} placeholderText="Wybierz model z listy..." onSelect={(option) => setModel(option.value)} />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={onClose}>
                                    <Text style={styles.modalButtonText}>Anuluj</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={onAddCar}>
                                    <Text style={styles.modalButtonText}>Dodaj</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </SelectModalProvider>
        </Modal >
    </SelectProvider >
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
        marginTop: 16,
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
    selectContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default CreateCarModal;