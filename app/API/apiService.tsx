import { Alert } from "react-native";

const GET_ALL_CARS_API_URL = 'https://mattu.bieda.it/api/car';

export async function getAllCars() {
    try {
        const response = await fetch(GET_ALL_CARS_API_URL);

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