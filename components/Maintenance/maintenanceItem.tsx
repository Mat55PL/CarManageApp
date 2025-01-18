import { MaintenanceItem } from "@/constants/Interfaces/IMaintenence";
import { View, Text } from "../Themed";
import { StyleSheet } from "react-native";

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
                    <Text style={styles.maintenanceItemCost}>Kwota: {item.cost.toFixed(2)} PLN</Text>
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
});


export default renderMaintenanceItems;