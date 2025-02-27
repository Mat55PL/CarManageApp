import { Alert } from "react-native";

const STATS_API_URL = 'https://mattu.bieda.it/api/Stats';

export async function getAllStats() {
    try {
        const response = await fetch(STATS_API_URL);

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