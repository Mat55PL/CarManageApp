import { Alert } from "react-native";

const FUEL_HISTORY_API_URL = 'https://mattu.bieda.it/api/CarFuelHistory';

export async function GetAllFuelHistoryForCarId(carId: number) {
    console.log(`Fetching fuel history for car with ID: ${carId}`);
    try {
        const response = await fetch(`${FUEL_HISTORY_API_URL}/car/${carId}`);

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
};