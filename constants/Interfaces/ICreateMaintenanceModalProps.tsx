export interface ICreateMaintenanceModalProps {
    isVisable: boolean;
    onClose: () => void;
    onAddMaintenance: () => void;
    carId: string;
    maintenanceDate: string;
    setMaintenanceDate: (date: string) => void;
    description: string;
    setDescription: (text: string) => void;
};