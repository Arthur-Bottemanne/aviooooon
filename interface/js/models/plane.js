import { CoordinateUtils } from "../utils/coordinates.js";
import * as Cesium from "cesium";

export class Plane {
    constructor(id, callsign, latitude, longitude, altitude, heading) {
        this.id = id;
        this.callsign = callsign;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.heading = heading;
    }

    get position() {
        return Cesium.Cartesian3.fromDegrees(this.longitude, this.latitude, this.altitude);
    }

    get icon() {
        return "assets/plane-icon.png";
    }

    static fromAzimuthElevation(observerLat, observerLon, observerAlt, azimuth, elevation, range) {
        const position = CoordinateUtils.azimuthElevationToCartesian(
            observerLat,
            observerLon,
            observerAlt,
            azimuth,
            elevation,
            range,
        );

        const cartographic = Cesium.Cartographic.fromCartesian(position);

        return new Plane(
            `az-${azimuth}-el-${elevation}`,
            "TRACKED",
            Cesium.Math.toDegrees(cartographic.latitude),
            Cesium.Math.toDegrees(cartographic.longitude),
            cartographic.height,
            azimuth,
        );
    }
}
