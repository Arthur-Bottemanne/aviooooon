import { ApiService } from "./api-service.js";
import { CoordinateUtils } from "../utils/coordinates.js";

export class MoonService extends ApiService {
    /**
     * Fetches moon data from the API and calculates its 3D position
     * @returns {Object} { cartesian, azimuth, elevation, phase }
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

            console.log("Values:", { latitude, longitude, azimuth, elevation });

            const LUNAR_DISTANCE = 384400000;

            const cartesian = CoordinateUtils.azElToCartesian(
                latitude,
                longitude,
                altitude,
                azimuth,
                elevation,
                LUNAR_DISTANCE
            );

            return {
                cartesian,
                azimuth,
                elevation,
                phase,
            };
        }

        throw new Error("Failed to retrieve moon data from API");
    }
}
