export interface CreateMaintenanceRecord {
    carId: number;
    maintenanceDate: string;
    description: string;
}

export interface CreateMaintenanceItem {
    maintenanceId: number;
    partName: string;
    description: string;
    cost: number;
};
