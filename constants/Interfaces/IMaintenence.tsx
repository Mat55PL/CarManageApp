export interface MaintenanceItem {
    maintenanceId: number;
    partName: string;
    description: string;
    cost: number;
}

export interface MaintenanceRecord {
    id: number;
    carId: number;
    maintenanceDate: string;
    description: string;
    maintenanceItems: MaintenanceItem[];
}
