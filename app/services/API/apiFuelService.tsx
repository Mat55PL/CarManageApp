import { ICreateFuel } from "@/constants/Interfaces/ICreateFuel";
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

export async function AddFuelHistoryForCarId(fuelHistory: ICreateFuel) {
    console.log(`Adding fuel history: ${JSON.stringify(fuelHistory)}`);
    try {
        const response = await fetch(FUEL_HISTORY_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fuelHistory),
        });

        const responseBody = await response.text();

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(`Response: ${responseBody}`);

        return responseBody;
    } catch (error: any) {
        Alert.alert("Wystąpił błąd", `Nie udało się dodać danych. Sprawdź połączenie z internetem. ${error.message}`, [{ text: "OK" }]);
        console.log(`Error: ${error}`);
        return;
    }
}

export async function DeleteFuelHistoryForCarId(fuelHistoryId: number) {
    console.log(`Deleting fuel history with ID: ${fuelHistoryId}`);
    try {
        const response = await fetch(`${FUEL_HISTORY_API_URL}/${fuelHistoryId}`, {
            method: 'DELETE',
        });

        const responseBody = await response.text();

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(`Response: ${responseBody}`);

        return responseBody;
    } catch (error: any) {
        Alert.alert("Wystąpił błąd", `Nie udało się usunąć danych. Sprawdź połączenie z internetem. ${error.message}`, [{ text: "OK" }]);
        console.log(`Error: ${error}`);
        return;
    }
}