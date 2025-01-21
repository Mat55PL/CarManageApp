import CreateMaintenanceItemModal from '@/app/modals/CreateMaintenanceItemModal';
import CreateMaintenanceModal from '@/app/modals/CreateMaintenanceModal';
import { AddCarMaintenance, AddCarMaintenanceItem, GetAllCarMaintenanceForCarId } from '@/app/services/API/apiCarMaintenanceService';
import renderMaintenanceItems from '@/components/Maintenance/maintenanceItem';
import { View, Text } from '@/components/Themed';
import { MaintenanceRecord, MaintenanceItem } from '@/constants/Interfaces/IMaintenence';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';

const MaintenanceInfoScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const carId = params.carId ? Number(params.carId) : null;
    const [maintenanceData, setMaintenanceData] = useState<MaintenanceRecord[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [expandedRecords, setExpandedRecords] = useState<{ [key: number]: boolean }>({});
    // new maintenance record modal
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    // new maintenance item modal
    const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
    // new maintenance record
    const [maintenanceDate, setMaintenanceDate] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    // new maintenance item
    const [partName, setPartName] = useState<string>('');
    const [cost, setCost] = useState<string>('0');
    const [maintenanceItemId, setMaintenanceItemId] = useState<string>('');
    const [descriptionItem, setDescriptionItem] = useState<string>('');
    const [maintenanceRecordId, setMaintenanceRecordId] = useState<Number>(0);

    const getData = async () => {
        if (carId == null) {
            setError("Car ID is null");
            return;
        }

        try {
            const response = await GetAllCarMaintenanceForCarId(carId);
            setMaintenanceData(response);
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const toggleRecordExpansion = (recordId: number) => {
        setExpandedRecords(prev => ({
            ...prev,
            [recordId]: !prev[recordId]
        }));
    };

    const showAddMaintenanceItemModal = (recordId: Number) => {
        console.log(`Add maintenance item for record with ID: ${recordId}`);
        setMaintenanceRecordId(recordId);
        setIsAddItemModalVisible(true);
    };

    const showAddMaintenanceRecordModal = () => {
        setIsAddModalVisible(true);
    };

    const convertToDateOnly = (date: string) => {
        //EXAMPLE: from 2025-01-16T10:40:00.000Z to 2024-01-16
        return date.split('T')[0];
    };

    const sendNewRecordToAPI = async () => {
        console.log(`[SendToAPI] Adding maintenance record for car with ID: ${carId}`);
        let onlyDate = convertToDateOnly(maintenanceDate);
        if (carId !== null) {
            await AddCarMaintenance({
                carId: carId,
                maintenanceDate: onlyDate,
                description: description,
            });
            // if success then refresh data
            getData();
        } else {
            setError("Car ID is null");
            return;
        }
    };

    const sendNewItemToAPI = async () => {
        console.log(`[SendToAPI] Adding maintenance item for record with ID: ${maintenanceRecordId}`);
        if (maintenanceRecordId !== 0) {
            await AddCarMaintenanceItem({
                maintenanceId: Number(maintenanceRecordId),
                partName: partName,
                cost: Number(cost),
                description: descriptionItem,
            });
            getData();
        } else {
            setError("Maintenance ID is null");
            return;
        }
    };

    const handleAddMaintenanceRecord = () => {
        console.log(`Adding maintenance record for car with ID: ${carId}`);
        console.log(`Data to add: ${maintenanceDate}, ${description}`);
        setIsAddModalVisible(false);
        sendNewRecordToAPI();
    };

    const handleAddMaintenanceItem = () => {
        console.log(`Adding maintenance item for record with ID: ${maintenanceItemId}`);
        console.log(`Data to add: ${partName}, ${cost}, ${descriptionItem}`);
        setIsAddItemModalVisible(false);
        sendNewItemToAPI();
    };

    const renderMaintenanceRecords = () => {
        return maintenanceData.map((record) => (
            <View key={`record-${record.id}`} style={styles.recordCard}>
                <TouchableOpacity
                    style={styles.recordHeader}
                    onPress={() => toggleRecordExpansion(record.id)}
                >
                    <View style={styles.recordHeaderContent}>
                        <Text style={styles.recordDate}>
                            {new Date(record.maintenanceDate).toLocaleDateString('pl-PL')}
                        </Text>
                        <Text style={styles.recordDescription}>{record.description}</Text>
                        <Text style={styles.expandIndicator}>
                            {expandedRecords[record.id] ? '▲' : '▼'}
                        </Text>
                    </View>
                </TouchableOpacity>

                {expandedRecords[record.id] && (
                    <View style={styles.expandedContent}>
                        {renderMaintenanceItems(record.id, record.maintenanceItems)}
                    </View>
                )}

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => showAddMaintenanceItemModal(record.id)}
                >
                    <Text style={styles.addButtonText}>+ Dodaj nowy przedmiot naprawy</Text>
                </TouchableOpacity>
            </View>
        ));
    };

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorTitle}>Error Detected! 🚨</Text>
                <Text style={styles.errorDescription}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Historia napraw pojazdu</Text>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                {renderMaintenanceRecords()}
            </ScrollView>
            <TouchableOpacity style={styles.addMaintenanceButton} onPress={showAddMaintenanceRecordModal}>
                <FontAwesome name="plus" size={22} color="white" />
            </TouchableOpacity>

            <CreateMaintenanceModal
                isVisable={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                onAddMaintenance={() => handleAddMaintenanceRecord()}
                carId={String(carId)}
                maintenanceDate={maintenanceDate}
                setMaintenanceDate={setMaintenanceDate}
                description={description}
                setDescription={setDescription}
            />

            <CreateMaintenanceItemModal
                isVisable={isAddItemModalVisible}
                onClose={() => setIsAddItemModalVisible(false)}
                onAddMaintenanceItem={() => handleAddMaintenanceItem()}
                maintenanceItemId={''}
                partName={partName}
                setPartName={setPartName}
                description={descriptionItem}
                setDescription={setDescriptionItem}
                cost={cost}
                setCost={setCost}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
        color: '#91cfa1',
    },
    addMaintenanceButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#74bf63',
        borderRadius: 50,
        padding: 16,
        elevation: 4,
    },
    scrollViewContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    recordCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    recordHeader: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recordHeaderContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
    },
    recordDate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginRight: 10,
    },
    recordDescription: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    expandIndicator: {
        color: '#666',
        fontSize: 14,
    },
    expandedContent: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#f9f9f9',
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#007bff',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    errorDescription: {
        fontSize: 16,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    modalCloseButton: {
        marginTop: 16,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 8,
    },
    modalCloseButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});

export default MaintenanceInfoScreen;