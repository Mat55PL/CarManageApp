import { Alert } from "react-native";
import { ICreateCar } from "@/constants/Interfaces/ICreateCar";

const CARS_API_URL = 'https://mattu.bieda.it/api/car';

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

export async function addCar(car: ICreateCar) {
    console.log(`Adding car: ${JSON.stringify(car)}`);
    try {
        const response = await fetch(CARS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(car),
        });

        const responseBody = await response.text();

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status} | body: ${responseBody}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(`Response: ${responseBody}`);
    } catch (error: any) {
        Alert.alert("Wystąpił błąd", `Nie udało się dodać pojazdu. Sprawdź połączenie z internetem. ${error.message}`, [{ text: "OK" }]);
        console.log(`Error: ${error}`);
    }
}

export async function deleteCar(carId: number) {
    console.log(`Deleting car with ID: ${carId}`);
    try {
        const response = await fetch(`${CARS_API_URL}/${carId}`, {
            method: 'DELETE',
        });

        const responseBody = await response.text();

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(`Response: ${responseBody}`);
    } catch (error: any) {
        Alert.alert("Wystąpił błąd", `Nie udało się usunąć pojazdu. Sprawdź połączenie z internetem. ${error.message}`, [{ text: "OK" }]);
        console.log(`Error: ${error}`);
    }
}

export async function updateCurrentCarUser(carId: number, userId: string) {
    // example update url: https://mattu.bieda.it/api/car/{carId}/current-user
    console.log(`Updating car with ID: ${carId} to user with ID: ${userId}`);
    try {
        const response = await fetch(`${CARS_API_URL}/${carId}/current-user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userId),
        });

        const responseBody = await response.text();

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log(`Response: ${responseBody}`);
    } catch (error: any) {
        Alert.alert("Wystąpił błąd", `Nie udało się zaktualizować pojazdu. Sprawdź połączenie z internetem. ${error.message}`, [{ text: "OK" }]);
        console.log(`[updateCurrentCarUser:ERROR] ${error}`);
    }
};
