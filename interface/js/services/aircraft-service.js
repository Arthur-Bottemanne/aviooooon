import { API_ENDPOINTS } from "../config/cesium-config.js";
import { Aircraft } from "../models/aircraft.js";

export class AircraftService {
    constructor() {
        this.updateInterval = null;
    }

    /**
     * Fetches aircraft within a specified radial distance from a center point.
     * @param {number} latitude - Center latitude in decimal degrees.
     * @param {number} longitude - Center longitude in decimal degrees.
     * @param {number} radius - The search radius in km.
     * @returns {Promise<Aircraft[]>} A promise resolving to an array of mapped Aircraft instances. 
     */
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

    /**
     * Initiates a periodic polling sequence to update aircraft data.
     * Automatically clears any existing polling interval before starting a new one.
     * @param {Function} callback - The function to be executed at every interval.
     * @param {number} [intervalMs=60000] - The polling frequency in milliseconds (defaults to 1 minute).
     * @returns {void}
     */
    startPolling(callback, intervalMs = 60000) {
        this.stopPolling();
        this.updateInterval = setInterval(callback, intervalMs);
    }

    /**
     * Stops the active polling sequence and clears the interval timer.
     * @returns {void}
     */
    stopPolling() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}