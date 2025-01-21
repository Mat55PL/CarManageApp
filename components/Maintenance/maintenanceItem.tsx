import { MaintenanceItem } from "@/constants/Interfaces/IMaintenence";
import { View, Text } from "../Themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const renderMaintenanceItems = (recordId: number, items: MaintenanceItem[]) => {
    const totalCost = items.reduce((sum, item) => sum + item.cost, 0);

    return (
        <>
            {items.map((item, index) => (
                <View
                    key={`${recordId}-item-${item.maintenanceId}-${index}`}
                    style={styles.maintenanceItemContainer}
                >
                    <Text style={styles.maintenanceItemTitle}>{item.partName}</Text>
                    <Text style={styles.maintenanceItemDescription}>{item.description}</Text>
                    <View style={styles.bottomRow}>
                        <Text style={styles.maintenanceItemCost}>Kwota: {item.cost.toFixed(2)} PLN</Text>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.btn}
                                onPress={() => {
                                    console.log('Edit maintenance item');
                                }}>
                                <Text style={styles.btnText}><FontAwesome name="edit" size={24} color="black" /></Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn}>
                                <Text style={styles.btnText}><FontAwesome name="trash-o" size={24} color="black" /></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
            <View style={styles.totalCostContainer}>
                <Text style={styles.totalCostText}>Suma wydatków: {totalCost.toFixed(2)} PLN</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    maintenanceItemContainer: {
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: 'transparent',
    },
    maintenanceItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    maintenanceItemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    maintenanceItemCost: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
    },
    totalCostContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'flex-end',
        backgroundColor: 'transparent',
    },
    totalCostText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4CAF50',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: 'transparent',
    },
    btn: {
        padding: 2,
    },
    btnText: {
        color: '#fff',
    }
});


export default renderMaintenanceItems;