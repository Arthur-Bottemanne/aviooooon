import { API_ENDPOINTS } from "../config/cesium-config.js";
import { Aircraft } from "../models/aircraft.js";

export class AircraftService {
    constructor() {
        this.updateInterval = null;
    }

    async fetchAircraftData(latitude, longitude, radius) {
        try {
            const response = await fetch(`${API_ENDPOINTS.aircraft}?lat=${latitude}&lon=${longitude}&radius=${radius}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.aircraft.map((rawData) => Aircraft.fromApiData(rawData));
        } catch (error) {
            console.error("Error fetching aircraft data:", error);
            return [];
        }
    }

    startPolling(callback, intervalMs = 5000) {
        this.stopPolling();
        this.updateInterval = setInterval(callback, intervalMs);
    }

    stopPolling() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}
