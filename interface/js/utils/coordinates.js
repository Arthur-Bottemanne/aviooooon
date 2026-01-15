import { Cesium } from "cesium";

export class CoordinateUtils {
    /**
     * Convert azimuth/elevation/range to Cartesian3 position
     * @param {number} observerLat - Observer latitude in degrees
     * @param {number} observerLon - Observer longitude in degrees
     * @param {number} observerAlt - Observer altitude in meters
     * @param {number} azimuth - Azimuth in degrees (0 = North, 90 = East)
     * @param {number} elevation - Elevation angle in degrees
     * @param {number} range - Distance in meters
     * @returns {Cesium.Cartesian3}
     */
    static azElToCartesian(observerLat, observerLon, observerAlt, azimuth, elevation, range) {
        const observerPosition = Cesium.Cartesian3.fromDegrees(observerLon, observerLat, observerAlt);

        // Convert to radians
        const azRad = Cesium.Math.toRadians(azimuth);
        const elRad = Cesium.Math.toRadians(elevation);

        // Calculate offset in ENU (East-North-Up) coordinates
        const east = range * Math.cos(elRad) * Math.sin(azRad);
        const north = range * Math.cos(elRad) * Math.cos(azRad);
        const up = range * Math.sin(elRad);

        // Create transformation matrix from ENU to ECEF
        const transform = Cesium.Transforms.eastNorthUpToFixedFrame(observerPosition);

        // Apply transformation
        const offset = new Cesium.Cartesian3(east, north, up);
        return Cesium.Matrix4.multiplyByPoint(transform, offset, new Cesium.Cartesian3());
    }

    /**
     * Calculate distance between two geographic points
     */
    static haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth radius in meters
        const φ1 = Cesium.Math.toRadians(lat1);
        const φ2 = Cesium.Math.toRadians(lat2);
        const Δφ = Cesium.Math.toRadians(lat2 - lat1);
        const Δλ = Cesium.Math.toRadians(lon2 - lon1);

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}
