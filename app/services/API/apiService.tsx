import { Alert } from "react-native";

const CARS_API_URL = 'https://mattu.bieda.it/api/car';
const CARS_FUEL_HISTORY_API_URL = 'https://mattu.bieda.it/api/CarFuelHistory';

export async function getAllCars() {
    try {
        const response = await fetch(CARS_API_URL);

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }
    catch (error: any) {
        Alert.alert("Występił błąd", `Nie udało się pobrać danych z serwera. Sprawdź połączenie z internetem. ${error.message}`, [{ text: "OK" }]);
    }

}

export async function getCarFuelHistory(carId: number) {
    try {
        const response = await fetch(`${CARS_FUEL_HISTORY_API_URL}/car/${carId}`);

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }
    catch (error: any) {
        Alert.alert("Wystąpił błąd", `Nie udało się pobrać danych z serwera. Sprawdź połączenie z internetem. ${error.message}`, [{ text: "OK" }]);
    }
}
