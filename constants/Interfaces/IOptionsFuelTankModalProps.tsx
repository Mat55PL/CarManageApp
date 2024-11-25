export interface IOptionsFuelTankModalProps {
    isVisible: boolean;
    selectedFuelHistoryId: number;
    onClose: () => void;
    onEditFuelTank: () => void;
    onDeleteFuelTank: () => void;
}