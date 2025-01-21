export interface ICreateMaintenanceItemModalProps {
    isVisable: boolean;
    onClose: () => void;
    onAddMaintenanceItem: () => void;
    maintenanceItemId: string;
    partName: string;
    setPartName: (name: string) => void;
    description: string;
    setDescription: (text: string) => void;
    cost: string;
    setCost: (price: string) => void;
};