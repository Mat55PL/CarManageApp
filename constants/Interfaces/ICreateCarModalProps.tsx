export interface ICreateCarModalProps {
    isVisible: boolean;
    onClose: () => void;
    onAddCar: () => void;
    brand: string;
    setBrand: (text: string) => void;
    model: string;
    setModel: (text: string) => void;
    vin: string;
    setVin: (text: string) => void;
    productionYear: string;
    setProductionYear: (text: string) => void;
    fuelType: number;
    setFuelType: (text: number) => void;
    wheelType: number;
    setWheelType: (text: number) => void;
    numberPlate: string;
    setNumberPlate: (text: string) => void;
}

