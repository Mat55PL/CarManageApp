import { ICreateCar } from "@/constants/Interfaces/ICreateCar";
import { Alert } from "react-native";

export function CarValidation(car: ICreateCar) {
    const errors: string[] = [];

    if (!car.brand) {
        errors.push('Marka samochodu jest wymagana');
        Alert.alert('Błąd 🛑', 'Marka samochodu jest wymagana');
        return errors;
    }

    if (!car.model) {
        errors.push('Model samochodu jest wymagany');
        Alert.alert('Błąd 🛑', 'Model samochodu jest wymagany');
        return errors;
    }

    if (!car.vin) {
        errors.push('Numer VIN jest wymagany');
        Alert.alert('Błąd 🛑', 'Numer VIN jest wymagany');
        return errors;
    }

    if (!car.year) {
        errors.push('Rok produkcji jest wymagany');
        Alert.alert('Błąd 🛑', 'Rok produkcji jest wymagany');
        return errors;
    }

    if (!car.numberPlate) {
        errors.push('Numer rejestracyjny jest wymagany');
        Alert.alert('Błąd 🛑', 'Numer rejestracyjny jest wymagany');
        return errors;
    }

    return errors;
}
