export enum CarFuelType {
    Benzyna = 0,
    Diesel = 1,
    Elektryczny = 2,
    Hybrydowy = 3,
    LPG = 4,
    CNG = 5,
    Wodorowy = 6,
    Inny = 7,
};

const FuelTypeNames = {
    [CarFuelType.Benzyna]: 'Benzyna',
    [CarFuelType.Diesel]: 'Diesel',
    [CarFuelType.Elektryczny]: 'Elektryczny',
    [CarFuelType.Hybrydowy]: 'Hybrydowy',
    [CarFuelType.LPG]: 'LPG',
    [CarFuelType.CNG]: 'CNG',
    [CarFuelType.Wodorowy]: 'Wodorowy',
    [CarFuelType.Inny]: 'Inny'
};

export const getFuelType = (fuelType: CarFuelType) => FuelTypeNames[fuelType]; 