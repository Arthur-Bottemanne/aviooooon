import { CESIUM_CONFIG } from "../config/cesium-config.js";
import * as Cesium from "cesium";

export class CameraManager {
    constructor(viewer) {
        this.viewer = viewer;
        this.configuration();
    }

    configuration() {
        const controller = this.viewer.scene.screenSpaceCameraController;
        controller.enableZoom = false;
        controller.enableTranslate = false;
        controller.enableTilt = false;
        controller.enableLook = true;
        controller.lookEventTypes = [Cesium.CameraEventType.LEFT_DRAG];
        controller.rotateEventTypes = undefined;
        controller.zoomEventTypes = undefined;

        this.viewer.scene.postRender.addEventListener(() => {
            const camera = this.viewer.camera;

            if (Math.abs(camera.roll) > 0.0) {
                camera.setView({
                    orientation: {
                        heading: camera.heading,
                        pitch: camera.pitch,
                        roll: 0.0,
                    },
                });
            }
        });
    }

    setViewpoint(longitude, latitude, altitude = CESIUM_CONFIG.camera.defaultAltitude, orientation) {
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
            orientation: orientation,
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
