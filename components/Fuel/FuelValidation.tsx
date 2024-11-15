import { ICreateFuel } from "@/constants/Interfaces/ICreateFuel";
import { Alert } from "react-native";

export function FuelValidation(fuel: ICreateFuel) {
    const errors: string[] = [];

    if (!fuel.date) {
        errors.push('Data jest wymagana');
        Alert.alert('Błąd 🛑', 'Data jest wymagana');
        return errors;
    }

    if (!fuel.fuelAmount) {
        errors.push('Ilość paliwa jest wymagana');
        Alert.alert('Błąd 🛑', 'Ilość paliwa jest wymagana');
        return errors;
    }

    if (!fuel.cost) {
        errors.push('Koszt jest wymagany');
        Alert.alert('Błąd 🛑', 'Koszt jest wymagany');
        return errors;
    }

    if (!fuel.odometer) {
        errors.push('Stan licznika jest wymagany');
        Alert.alert('Błąd 🛑', 'Stan licznika jest wymagany');
        return errors;
    }

    if (!fuel.fuelType) {
        errors.push('Typ paliwa jest wymagany');
        Alert.alert('Błąd 🛑', 'Typ paliwa jest wymagany');
        return errors;
    }

    if (!fuel.location) {
        errors.push('Lokalizacja jest wymagana');
        Alert.alert('Błąd 🛑', 'Lokalizacja jest wymagana');
        return errors;
    }

    return errors;
};