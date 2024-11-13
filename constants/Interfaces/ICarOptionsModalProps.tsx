import { ICar } from "./ICar";

export interface ICarOptionsModalProps {
    isVisible: boolean;
    onClose: () => void;
    selectedCar: ICar | null;
    onDeleteCar: () => void;
    onEditCar: () => void;
    onFuelHistory: () => void;
}
