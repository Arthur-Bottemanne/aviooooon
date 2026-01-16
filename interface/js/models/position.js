import * as Cesium from "cesium";

export class Position {
    /**
     * @param {number} azimuth - Azimuth in degrees (0-360, 0=North, 90=East)
     * @param {number} elevation - Elevation angle in degrees (-90 to 90)
     * @param {number} range - Distance in meters
     */
    constructor(azimuth, elevation, range) {
        this.azimuth = this.normalizeAzimuth(azimuth);
        this.elevation = this.clampElevation(elevation);
        this.range = Math.max(0, range);
    }

    normalizeAzimuth(azimuth) {
        let normalized = azimuth % 360;
        return normalized < 0 ? normalized + 360 : normalized;
    }

    clampElevation(elevation) {
        return Math.max(-90, Math.min(90, elevation));
    }

    toCartesian3(observerLat, observerLon, observerAlt) {
        const observerPosition = Cesium.Cartesian3.fromDegrees(observerLon, observerLat, observerAlt);

        const azRad = Cesium.Math.toRadians(this.azimuth);
        const elRad = Cesium.Math.toRadians(this.elevation);

        const east = this.range * Math.cos(elRad) * Math.sin(azRad);
        const north = this.range * Math.cos(elRad) * Math.cos(azRad);
        const up = this.range * Math.sin(elRad);

        const transform = Cesium.Transforms.eastNorthUpToFixedFrame(observerPosition);
        const offset = new Cesium.Cartesian3(east, north, up);

        return Cesium.Matrix4.multiplyByPoint(transform, offset, new Cesium.Cartesian3());
    }

    getCompassDirection() {
        const directions = [
            "N",
            "NNE",
            "NE",
            "ENE",
            "E",
            "ESE",
            "SE",
            "SSE",
            "S",
            "SSW",
            "SW",
            "WSW",
            "W",
            "WNW",
            "NW",
            "NNW",
        ];
        const index = Math.round(this.azimuth / 22.5) % 16;
        return directions[index];
    }

    isAboveHorizon() {
        return this.elevation > 0;
    }

    getAltitudeCategory() {
        if (this.elevation < 0) return "below_horizon";
        if (this.elevation < 30) return "low";
        if (this.elevation < 60) return "medium";
        return "high";
    }

    angularSeparation(other) {
        const az1 = Cesium.Math.toRadians(this.azimuth);
        const el1 = Cesium.Math.toRadians(this.elevation);
        const az2 = Cesium.Math.toRadians(other.azimuth);
        const el2 = Cesium.Math.toRadians(other.elevation);

        const separation = Math.acos(
            Math.sin(el1) * Math.sin(el2) + Math.cos(el1) * Math.cos(el2) * Math.cos(az1 - az2)
        );

        return Cesium.Math.toDegrees(separation);
    }

    static fromCartesian3(position, observerLat, observerLon, observerAlt) {
        const observerPosition = Cesium.Cartesian3.fromDegrees(observerLon, observerLat, observerAlt);

        const direction = Cesium.Cartesian3.subtract(position, observerPosition, new Cesium.Cartesian3());

        const range = Cesium.Cartesian3.magnitude(direction);
        Cesium.Cartesian3.normalize(direction, direction);

        const enuTransform = Cesium.Transforms.eastNorthUpToFixedFrame(observerPosition);
        const inverseTransform = Cesium.Matrix4.inverse(enuTransform, new Cesium.Matrix4());
        const directionENU = Cesium.Matrix4.multiplyByPointAsVector(
            inverseTransform,
            direction,
            new Cesium.Cartesian3()
        );

        let azimuth = Cesium.Math.toDegrees(Math.atan2(directionENU.x, directionENU.y));
        if (azimuth < 0) azimuth += 360;

        const elevation = Cesium.Math.toDegrees(Math.asin(directionENU.z));

        return new Position(azimuth, elevation, range);
    }

    static fromApiData(data) {
        return new Position(data.azimuth || data.az, data.elevation || data.el, data.range || data.distance);
    }

    toObject() {
        return {
            azimuth: this.azimuth,
            elevation: this.elevation,
            range: this.range,
            compassDirection: this.getCompassDirection(),
            aboveHorizon: this.isAboveHorizon(),
        };
    }

    toString() {
        return (
            `Az: ${this.azimuth.toFixed(1)}° (${this.getCompassDirection()}), ` +
            `El: ${this.elevation.toFixed(1)}°, ` +
            `Range: ${(this.range / 1000).toFixed(1)} km`
        );
    }
}
