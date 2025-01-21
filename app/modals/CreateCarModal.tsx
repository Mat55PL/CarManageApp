import React, { useState } from "react";
import { Text, Modal, View, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { Select, SelectModalProvider, SelectProvider } from '@mobile-reality/react-native-select-pro';
import { ICreateCarModalProps } from "@/constants/Interfaces/ICreateCarModalProps";
import { getCarsBrands, getCarsModels } from "../services/Files/fileSystem";
import { CarFuelType, FuelTypeNames } from "@/constants/Enums/CarFuelType";
import { CarTyreType, CarTyreTypeNames } from "@/constants/Enums/CarTyreType";

const CreateCarModal: React.FC<ICreateCarModalProps> = ({
    isVisible, onClose, onAddCar, brand, setBrand, model, setModel, vin, setVin,
    productionYear, setProductionYear, fuelType, setFuelType, wheelType, setWheelType,
    numberPlate, setNumberPlate
}) => {
    const [step, setStep] = useState(1);

    const resetForm = () => {
        setBrand('');
        setModel('');
        setProductionYear('');
        setVin('');
        setFuelType(undefined);
        setNumberPlate('');
        setWheelType(undefined);
        setStep(1);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleNextStep = () => {
        if (brand && model && productionYear) {
            setStep(2);
        } else {
            Alert.alert('Uwaga', 'Proszę wypełnić wszystkie wymagane pola', [{ text: 'OK' }]);
        }
    };

    const handleAddCar = () => {
        if (vin && fuelType !== undefined && numberPlate && wheelType !== undefined) {
            onAddCar();
            handleClose();
        } else {
            alert('Proszę wypełnić wszystkie wymagane pola');
        }
    };

    return (
        <SelectProvider>
            <Modal
                visible={isVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleClose}
            >
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <SelectModalProvider>
                        <View style={styles.modalContainer}>
                            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>
                                        {step === 1 ? "Dodaj nowy pojazd - Krok 1" : "Dodaj nowy pojazd - Krok 2"}
                                    </Text>

                                    {step === 1 && (
                                        <>
                                            <Text style={styles.subtitle}>Marka</Text>
                                            <Select
                                                options={getCarsBrands().map(brand => ({ label: brand, value: brand }))}
                                                searchable={true}
                                                placeholderText="Wybierz pojazd z listy..."
                                                onSelect={(option) => {
                                                    setBrand(option.value);
                                                    setModel('');
                                                }}
                                            />

                                            <Text style={styles.subtitle}>Model</Text>
                                            <Select
                                                options={brand ? getCarsModels(brand).map(model => ({ label: model, value: model })) : []}
                                                key={brand}
                                                searchable={true}
                                                placeholderText="Wybierz model z listy..."
                                                noOptionsText="Wybierz najpierw markę pojazdu"
                                                onSelect={(option) => setModel(option.value)}
                                            />

                                            <Text style={styles.subtitle}>Rok produkcji</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={productionYear}
                                                onChangeText={setProductionYear}
                                                inputMode="numeric"
                                                placeholder="Wprowadź rok produkcji"
                                            />
                                        </>
                                    )}

                                    {step === 2 && (
                                        <>
                                            <Text style={styles.subtitle}>Numer VIN</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={vin}
                                                onChangeText={setVin}
                                                placeholder="Wprowadź numer VIN"
                                            />

                                            <Text style={styles.subtitle}>Numer tablicy rejestracyjnej</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={numberPlate}
                                                onChangeText={setNumberPlate}
                                                placeholder="Wprowadź numer rejestracyjny"
                                            />

                                            <Text style={styles.subtitle}>Rodzaj paliwa</Text>
                                            <Select
                                                options={Object.entries(FuelTypeNames).map(([value, label]) => ({
                                                    label: label,
                                                    value: value
                                                }))}
                                                placeholderText="Wybierz rodzaj paliwa..."
                                                onSelect={(option) => setFuelType(Number(option.value))}
                                            />

                                            <Text style={styles.subtitle}>Rodzaj opon</Text>
                                            <Select
                                                options={Object.entries(CarTyreTypeNames).map(([value, label]) => ({
                                                    label: label,
                                                    value: value
                                                }))}
                                                placeholderText="Wybierz rodzaj opon..."
                                                onSelect={(option) => setWheelType(Number(option.value))}
                                            />
                                        </>
                                    )}

                                    <View style={styles.modalButtons}>
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.modalButtonCancel]}
                                            onPress={step === 1 ? handleClose : () => setStep(1)}
                                        >
                                            <Text style={styles.modalButtonText}>
                                                {step === 1 ? "Anuluj" : "Wstecz"}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.modalButton}
                                            onPress={step === 1 ? handleNextStep : handleAddCar}
                                        >
                                            <Text style={styles.modalButtonText}>
                                                {step === 1 ? "Dalej" : "Dodaj"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </SelectModalProvider>
                </KeyboardAvoidingView>
            </Modal>
        </SelectProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    modalContent: {
        padding: 16,
    },
    modalTitle: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
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
        marginBottom: 8,
    },
});

export default CreateCarModal;