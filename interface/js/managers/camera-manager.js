import { CESIUM_CONFIG } from "../config/cesium-config.js";
import { Cesium } from "cesium";

export class CameraManager {
    constructor(viewer) {
        this.viewer = viewer;
    }

    setViewpoint(longitude, latitude, altitude = CESIUM_CONFIG.camera.defaultAltitude) {
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(CESIUM_CONFIG.camera.defaultPitch),
                roll: 0.0,
            },
        });
    }

    flyTo(longitude, latitude, altitude, duration = 2.0) {
        return this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
            duration: duration,
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(CESIUM_CONFIG.camera.defaultPitch),
                roll: 0.0,
            },
        });
    }

    lookAt(targetPosition, offset) {
        this.viewer.camera.lookAt(
            targetPosition,
            new Cesium.HeadingPitchRange(offset.heading, offset.pitch, offset.range)
        );
    }
}
