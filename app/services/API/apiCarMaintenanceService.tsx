import { CreateMaintenanceItem, CreateMaintenanceRecord } from "@/constants/Interfaces/ICreateMaintenanceRecord";
import { Alert } from "react-native";

const CAR_MAINTENANCE_API_URL = 'https://mattu.bieda.it/api/CarMaintenance';

export async function GetAllCarMaintenanceForCarId(carId: number) {
    console.log(`Fetching car maintenance for car with ID: ${carId}`);
    try {
        const response = await fetch(`${CAR_MAINTENANCE_API_URL}/car/${carId}`);

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        Alert.alert("Wystąpił błąd", `Nie udało się pobrać danych z serwera. Sprawdź połączenie z internetem. ${error.message}`, [{ text: "OK" }]);
    }
};

export async function AddCarMaintenance(maintenance: CreateMaintenanceRecord) {
    console.log(`[AddCarMaintenance] Adding maintenance for car with ID: ${maintenance.carId}`);
    console.log(`[AddCarMaintenance] Maintenance date: ${maintenance.maintenanceDate}`);
    console.log(`[AddCarMaintenance] Description: ${maintenance.description}`);

    try {
        const response = await fetch(`${CAR_MAINTENANCE_API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(maintenance),
        });

        // Jednorazowe odczytanie strumienia odpowiedzi
        const responseBody = await response.text();

        // Sprawdzamy czy odpowiedź jest OK
        if (!response.ok) {
            // Skoro mamy już treść w `responseBody`, nie musimy wywoływać `response.text()` ponownie.
            console.error(`[AddCarMaintenance] HTTP error! status: ${response.status}, body: ${responseBody}`);
            throw new Error(`[AddCarMaintenance] HTTP error! status: ${response.status}, body: ${responseBody}`);
        }

        // W przypadku powodzenia - wypisujemy treść
        console.log(`[AddCarMaintenance] Response: ${responseBody}`);
    } catch (error: any) {
        Alert.alert(
            "Wystąpił błąd",
            `Nie udało się dodać danych do serwera. Sprawdź połączenie z internetem.\n${error.message}`,
            [{ text: "OK" }]
        );
        // Wypisujemy błąd, jeśli istnieje
        console.log(`[AddCarMaintenance] ${error} | Status: ${error?.status}`);
    }
}


export async function AddCarMaintenanceItem(maintenanceItem: CreateMaintenanceItem) {
    console.log(`[AddCarMaintenanceItem] Adding maintenance item for maintenance with ID: ${maintenanceItem.maintenanceId}`);
    try {
        const response = await fetch(`${CAR_MAINTENANCE_API_URL}/${maintenanceItem.maintenanceId}/maintenanceItem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(maintenanceItem)
        });

        const responseBody = await response.text();

        if (!response.ok) {
            console.error(`[AddCarMaintenanceItem] HTTP error! status: ${response.status}`);
            throw new Error(`[AddCarMaintenanceItem] HTTP error! status: ${response.status}`);
        }

        console.log(`[AddCarMaintenanceItem] Response: ${responseBody}`);
    } catch (error: any) {
        Alert.alert("Wystąpił błąd", `Nie udało się dodać danych do serwera. Sprawdź połączenie z internetem. ${error.message}`, [{ text: "OK" }]);
        console.log(`[AddCarMaintenanceItem] Error: ${error}`);
    }
};