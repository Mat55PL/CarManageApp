import { View, Text } from "@/components/Themed";
import { ICreateMaintenanceItemModalProps } from "@/constants/Interfaces/ICreateMaintenanceItemModalProps";
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, TouchableOpacity } from "react-native";

const CreateMaintenanceItemModal: React.FC<ICreateMaintenanceItemModalProps> = ({
    isVisable,
    onClose,
    onAddMaintenanceItem,
    maintenanceItemId,
    partName,
    setPartName,
    description,
    setDescription,
    cost,
    setCost
}) => {
    return (
        <Modal visible={isVisable} animationType="slide"
            onRequestClose={onClose} transparent={true}>
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>🔧 Dodaj część</Text>
                        <Text style={styles.formInputLabel}>Nazwa części (wymagane)</Text>
                        <TextInput
                            style={styles.TextInput}
                            value={partName}
                            onChangeText={setPartName}
                        />
                        <Text style={styles.formInputLabel}>Cena (wymagane)</Text>
                        <TextInput
                            style={styles.TextInput}
                            value={cost}
                            onChangeText={setCost}
                            inputMode="numeric"
                            keyboardType="numeric"
                        />
                        <Text style={styles.formInputLabel}>Opis (opcjonalne)</Text>
                        <TextInput
                            style={styles.TextInput}
                            value={description}
                            onChangeText={setDescription}
                        />
                        <View style={styles.btnContainer}>
                            <TouchableOpacity
                                style={styles.btnCancel}
                                onPress={onClose}
                            >
                                <Text style={{ color: 'white', textAlign: 'center' }}>Anuluj</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.btnSave}
                                onPress={onAddMaintenanceItem}
                            >
                                <Text style={{ color: 'white', textAlign: 'center' }}>Zapisz</Text>
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
        backgroundColor: 'transparent',
    },
    modalContent: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
        color: '#91cfa1',
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        backgroundColor: 'transparent',
    },
    btnCancel: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 8,
        width: '48%',
    },
    btnSave: {
        backgroundColor: '#4caf50',
        padding: 10,
        borderRadius: 8,
        width: '48%',
    },
    formInputLabel: {
        color: '#333',
        fontSize: 16,
        marginBottom: 5,
    },
    TextInput: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
});

export default CreateMaintenanceItemModal;