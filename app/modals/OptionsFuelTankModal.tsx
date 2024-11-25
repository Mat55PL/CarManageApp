import { IOptionsFuelTankModalProps } from "@/constants/Interfaces/IOptionsFuelTankModalProps";
import React from "react";
import { Text, View } from "@/components/Themed";
import { KeyboardAvoidingView, Modal, Platform, TouchableOpacity, StyleSheet } from "react-native";




const OptionsFuelTankModal: React.FC<IOptionsFuelTankModalProps> = ({
    isVisible, selectedFuelHistoryId, onClose, onEditFuelTank, onDeleteFuelTank
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
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, styles.editButton]} onPress={onEditFuelTank}>
                                <Text style={styles.modalButtonText}>Edytuj zapis tankowania</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={onDeleteFuelTank}>
                                <Text style={styles.modalButtonText}>Usuń zapis tankowania [{selectedFuelHistoryId}]</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
    },
    editButton: {
        backgroundColor: '#3498db',
    },
    historyButton: {
        backgroundColor: '#ffbd03',
    },
    cancelButton: {
        backgroundColor: '#95a5a6',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    buttonIcon: {
        marginRight: 10, // Odstęp między ikoną a tekstem
    }
});

export default OptionsFuelTankModal;