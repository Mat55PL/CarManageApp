import { Text, View } from "@/components/Themed";
import { ICreateMaintenanceModalProps } from "@/constants/Interfaces/ICreateMaintenanceModalProps";
import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import DatePicker from "react-native-date-picker";

const CreateMaintenanceModal: React.FC<ICreateMaintenanceModalProps> = ({
    isVisable,
    onClose,
    onAddMaintenance,
    carId,
    maintenanceDate,
    setMaintenanceDate,
    description,
    setDescription
}) => {
    const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(maintenanceDate ? new Date(maintenanceDate) : new Date());

    const resetForm = () => {
        setSelectedDate(new Date());
        setDescription('');
        console.log('resetForm');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDateConfirm = (date: Date) => {
        setSelectedDate(date);
        setMaintenanceDate(date.toISOString());
        setIsOpenDatePicker(false);
    };

    return (
        <Modal visible={isVisable} animationType="slide"
            onRequestClose={handleClose} transparent={true}>
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>🛠️ Dodaj serwis</Text>
                        <View style={styles.formContainer}>
                            <TouchableOpacity
                                style={styles.datePickerButton}
                                onPress={() => setIsOpenDatePicker(true)}
                            >
                                <View style={styles.datePickerContent}>
                                    <Text style={styles.datePickerIcon}>📅</Text>
                                    <View style={styles.datePickerTextContainer}>
                                        <Text style={styles.datePickerLabel}>Data przeglądu</Text>
                                        <Text style={styles.datePickerValue}>
                                            {formatDate(selectedDate)}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                open={isOpenDatePicker}
                                date={selectedDate}
                                mode="date"
                                locale="pl-PL"
                                confirmText="Zatwierdź"
                                cancelText="Anuluj"
                                onConfirm={handleDateConfirm}
                                onCancel={() => setIsOpenDatePicker(false)}
                            />
                            <Text style={styles.formInputLabel}>Tytuł naprawy</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="np. Serwis ASO Rzeszów"
                                value={description}
                                onChangeText={setDescription}
                            />
                            <Text style={styles.additionalInfo}>
                                Szczegóły naprawy dodaj poprzez kliknięcie w przycisk "Dodaj nowy przedmiot naprawy" po zapisaniu serwisu 🛠️
                            </Text>
                        </View>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity style={styles.btnCancel} onPress={handleClose}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Anuluj</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSave} onPress={onAddMaintenance}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Dodaj</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

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
        color: '#333',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    formContainer: {
        backgroundColor: 'transparent',
    },
    formInputLabel: {
        color: '#333',
        fontSize: 16,
        marginBottom: 5,
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
    datePickerButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    datePickerContent: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
    },
    datePickerIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    datePickerTextContainer: {
        backgroundColor: 'transparent',
        flex: 1,
    },
    datePickerLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    datePickerValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    textInput: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    additionalInfo: {
        color: '#666',
        fontSize: 14,
    }
})

export default CreateMaintenanceModal;