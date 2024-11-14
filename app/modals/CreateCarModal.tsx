import React from "react";
import { Text, Modal, View, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Select, SelectModalProvider, SelectProvider } from '@mobile-reality/react-native-select-pro';
import { ICreateCarModalProps } from "@/constants/Interfaces/ICreateCarModalProps";
import { getCarsBrands, getCarsModels } from "../services/Files/fileSystem";
import { CarFuelType } from "@/constants/Enums/CarFuelType";
import { CarTyreType } from "@/constants/Enums/CarTyreType";
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
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View style={styles.modalOverlay}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Dodaj nowy pojazd</Text>
                                <Text style={styles.subtitle}>Marka</Text>
                                <Select
                                    options={getCarsBrands().map(brand => ({ label: brand, value: brand }))} searchable={true}
                                    placeholderText="Wybierz pojazd z listy..."
                                    onSelect={(option) => {
                                        setBrand(option.value);
                                        setModel('');
                                    }} />
                                <Text style={styles.subtitle}>Model</Text>
                                <Select options={brand ? getCarsModels(brand).map(model => ({ label: model, value: model })) : []}
                                    key={brand}
                                    searchable={true} placeholderText="Wybierz model z listy..."
                                    noOptionsText="Wybierz najpierw markę pojazdu"
                                    onSelect={(option) => setModel(option.value)} />
                                <Text style={styles.subtitle}>Numer VIN</Text>
                                <TextInput style={styles.input} value={vin} onChangeText={setVin} />
                                <Text style={styles.subtitle}>Rok produkcji</Text>
                                <TextInput style={styles.input} value={productionYear} onChangeText={setProductionYear} inputMode="numeric" />
                                <Text style={styles.subtitle}>Rodzaj paliwa</Text>
                                <Select options={Object.keys(CarFuelType).map(fuelType => ({ label: fuelType, value: fuelType }))}
                                    placeholderText="Wybierz rodzaj paliwa..." onSelect={(option) => setFuelType(Number(option.value))} />
                                <Text style={styles.subtitle}>Numer tablicy rejestracyjnej</Text>
                                <TextInput style={styles.input} value={numberPlate} onChangeText={setNumberPlate} />
                                <Text style={styles.subtitle}>Rodzaj opon</Text>
                                <Select options={Object.keys(CarTyreType).map(wheelType => ({ label: wheelType, value: wheelType }))}
                                    placeholderText="Wybierz rodzaj opon..." onSelect={(option) => setWheelType(Number(option.value))} />
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={onClose}>
                                        <Text style={styles.modalButtonText}>Anuluj</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.modalButton} onPress={onAddCar}>
                                        <Text style={styles.modalButtonText}>Dodaj</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </SelectModalProvider>
        </Modal >
    </SelectProvider >
);

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    modalContent: {
        width: '100%',
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