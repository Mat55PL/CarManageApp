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
    fuelType: any;
    setFuelType: (text: any) => void;
    wheelType: number;
    setWheelType: (text: any) => void;
    numberPlate: string;
    setNumberPlate: (text: string) => void;
}

