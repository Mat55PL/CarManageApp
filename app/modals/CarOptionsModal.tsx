import { Text, View } from "@/components/Themed";
import { ICarOptionsModalProps } from "@/constants/Interfaces/ICarOptionsModalProps";
import React from "react";
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, TouchableOpacity } from "react-native";

const CarOptionsModal: React.FC<ICarOptionsModalProps> = ({
    isVisible, onClose, onDeleteCar, onEditCar, selectedCar
}) => {
    return (
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
                        <Text style={styles.modalTitle}>🛠️ Opcje</Text>
                        <Text style={styles.subtitle}>Dla pojazdu [{selectedCar?.id}] {selectedCar?.brand} {selectedCar?.model}</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={onDeleteCar}>
                                <Text style={styles.modalButtonText}>Usuń pojazd</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.editButton]} onPress={onEditCar}>
                                <Text style={styles.modalButtonText}>Edytuj pojazd</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.historyButton]} onPress={onClose}>
                                <Text style={styles.modalButtonText}>Sprawdź historie tankowania</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
                                <Text style={styles.modalButtonText}>Anuluj</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    keyboardAvoidingView: {
        width: '100%',
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 20,
    },
    modalTitle: {
        color: '#333',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        color: '#666',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'column', // Pionowy układ przycisków
        // flexDirection: 'row', // poziomy układ
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    modalButton: {
        flexDirection: 'row', // Umożliwia dodanie ikon obok tekstu
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 10,
        // width: '100%', // ustawić na 100%, jeśli chcesz przyciski pełnej szerokości
    },
    deleteButton: {
        backgroundColor: '#e74c3c', // Czerwień
    },
    editButton: {
        backgroundColor: '#3498db', // Niebieski
    },
    historyButton: {
        backgroundColor: '#ffbd03', // Żółty dla historii
    },
    cancelButton: {
        backgroundColor: '#95a5a6', // Szary
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    buttonIcon: {
        marginRight: 10, // Odstęp między ikoną a tekstem
    }
});


export default CarOptionsModal;