import { Cesium } from "cesium";
import { CoordinateUtils } from "../utils/coordinates.js";

export class Aircraft {
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
        return "assets/aircraft-icon.png";
    }

    static fromApiData(data) {
        return new Aircraft(
            data.hex,
            data.flight?.trim() || "N/A",
            data.lat,
            data.lon,
            data.alt_baro * 0.3048, // Convert feet to meters
            data.track || 0
        );
    }

    static fromAzimuthElevation(observerLat, observerLon, observerAlt, azimuth, elevation, range) {
        const position = CoordinateUtils.azElToCartesian(
            observerLat,
            observerLon,
            observerAlt,
            azimuth,
            elevation,
            range
        );

        const cartographic = Cesium.Cartographic.fromCartesian(position);

        return new Aircraft(
            `az-${azimuth}-el-${elevation}`,
            "TRACKED",
            Cesium.Math.toDegrees(cartographic.latitude),
            Cesium.Math.toDegrees(cartographic.longitude),
            cartographic.height,
            azimuth
        );
    }
}
