import carsNamesData from '@/constants/car-list.json';

export const getCarsBrands = () => {
    const carsBrands = carsNamesData.map((car) => car.brand);
    return carsBrands;
};

export const getCarsModels = (brand: any) => {
    const car = carsNamesData.find((car) => car.brand === brand);
    return car ? car.models : [];
};

