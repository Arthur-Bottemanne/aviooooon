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
            this._fixCamera()
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

    lookAtTarget(targetPosition) {
        const camera = this.viewer.camera;
        
        const direction = Cesium.Cartesian3.subtract(
            targetPosition, 
            camera.position, 
            new Cesium.Cartesian3()
        );
        Cesium.Cartesian3.normalize(direction, direction);

        camera.setView({
            orientation: {
                direction: direction,
                up: Cesium.Cartesian3.normalize(camera.position, new Cesium.Cartesian3())
            }
        });
    }
    
    _fixCamera() {
        const camera = this.viewer.camera;

        const maxPitch = Cesium.Math.toRadians(80);
        const minPitch = Cesium.Math.toRadians(-80);

        if (camera.pitch > maxPitch || camera.pitch < minPitch) {
            const clampedPitch = Cesium.Math.clamp(camera.pitch, minPitch, maxPitch);
            
            camera.setView({
                orientation: {
                    heading: camera.heading,
                    pitch: clampedPitch,
                    roll: 0.0, // Keeping your existing roll fix
                },
            });
        }

        if (Math.abs(camera.roll) > 0.0) {
            camera.setView({
                orientation: {
                    heading: camera.heading,
                    pitch: camera.pitch,
                    roll: 0.0,
                },
            });
        }
    }
}
