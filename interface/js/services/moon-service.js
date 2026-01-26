import { ApiService } from "./api-service.js";
import { CoordinateUtils } from "../utils/coordinates.js";

export class MoonService extends ApiService {
    constructor() {
        super()
        this.data = null;
    }

    /**
     * Retrieves lunar positional and phase data for a specific location and time.
     * @param {number} latitude - Observer latitude in decimal degrees.
     * @param {number} longitude - Observer longitude in decimal degrees.
     * @param {number} [altitude=0] - Observer altitude in meters above sea level.
     * @param {Date} [date=new Date()] - The date and time for which to calculate moon data.
     * @returns {Promise<Object>} A promise that resolves to an object containing cartesian coordinates, azimuth, elevation, and phase.
     * @throws {Error} Throws an error if the API request fails.
     */
    async getMoonData(latitude, longitude, altitude = 0, date = new Date()) {
        const params = {
            latitude: latitude,
            longitude: longitude,
            date: date.toISOString(),
        };

        const response = await this.get("/moon", params);

        if (response.status === "success") {
            const { azimuth, elevation, phase } = response.data;

            console.log("Retrieved lunar data:", { latitude, longitude, azimuth, elevation });

            const LUNAR_DISTANCE = 384400000;

            const cartesian = CoordinateUtils.azimuthElevationToCartesian(
                latitude,
                longitude,
                altitude,
                azimuth,
                elevation,
                LUNAR_DISTANCE
            );

            this.data = {
                cartesian,
                azimuth,
                elevation,
                phase,
            };

            return this.data;
        }

        throw new Error("Failed to retrieve moon data from API");
    }

    /**
     * Retrieves the phase name of the moon.
     * 
     * WARNING: `getMoonData` must be called at least once before this method!
     * @returns {string}
     * @throws {Error} Throws an error if the moon data wasn't retrieved previously.
     */
    async getPhaseName() {
        if (this.data === null) {
            throw new Error("Moon data wasn't fetched. Please wait for the moon to be generated before getting the phase.");
        }

        const phase = this.data.phase;

        if (phase <= 0.02 || phase >= 0.98) return "New Moon";
        if (phase < 0.23) return "Waxing Crescent";
        if (phase <= 0.27) return "First Quarter";
        if (phase < 0.48) return "Waxing Gibbous";
        if (phase <= 0.52) return "Full Moon";
        if (phase < 0.73) return "Waning Gibbous";
        if (phase <= 0.77) return "Last Quarter";
        return "Waning Crescent";
    }
}
