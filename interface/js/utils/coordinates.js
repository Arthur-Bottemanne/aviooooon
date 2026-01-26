import * as Cesium from "cesium";

export class CoordinateUtils {
    /**
     * Convert azimuth/elevation/range to Cartesian3 position
     * @param {number} observerLat - Observer latitude in degrees
     * @param {number} observerLon - Observer longitude in degrees
     * @param {number} observerAlt - Observer altitude in meters
     * @param {number} az - Azimuth in degrees (0 = North, 90 = East)
     * @param {number} el - Elevation angle in degrees
     * @param {number} r - Distance in meters
     * @returns {Cesium.Cartesian3}
     */
    static azimuthElevationToCartesian(observerLat, observerLon, observerAlt, az, el, r) {
        const latitude = Number(observerLat);
        const longitude = Number(observerLon);
        const altitude = Number(observerAlt);
        const azimuth = Number(az);
        const elevation = Number(el);
        const range = Number(r);

        const observerPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude);

        const azimuthRad = Cesium.Math.toRadians(azimuth);
        const elevationRad = Cesium.Math.toRadians(elevation);

        const east = range * Math.cos(elevationRad) * Math.sin(azimuthRad);
        const north = range * Math.cos(elevationRad) * Math.cos(azimuthRad);
        const up = range * Math.sin(elevationRad);

        const transform = Cesium.Transforms.eastNorthUpToFixedFrame(observerPosition);
        const offset = new Cesium.Cartesian3(east, north, up);

        return Cesium.Matrix4.multiplyByPoint(transform, offset, new Cesium.Cartesian3());
    }
}
