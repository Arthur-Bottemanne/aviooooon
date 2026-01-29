import * as Cesium from "cesium";

export class CameraManager {
    constructor(viewer, config) {
        this.viewer = viewer;
        this.config = config;
        this.configuration();
    }

    /**
     * Configures the screen-space camera controller to restrict movement types.
     *
     * Disables zoom, translation, and tilt while enabling a custom drag-to-look behavior.
     *
     * Also attaches a post-render listener to enforce camera constraints.
     * @returns {void}
     */
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
            this._fixCamera();
        });
    }

    /**
     * Instantly moves the camera to a specified geographic coordinate.
     * @param {number} longitude - Target longitude in decimal degrees.
     * @param {number} latitude - Target latitude in decimal degrees.
     * @param {number} [altitude=this.config.camera.defaultAltitude] - Camera height in meters.
     * @param {Object} orientation - Heading, pitch, and roll object for the camera.
     * @returns {void}
     */
    setViewpoint(longitude, latitude, altitude = this.config.camera.defaultAltitude, orientation) {
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
            orientation: orientation,
        });
    }

    /**
     * Smoothly animates the camera to a new geographic location.
     * @param {number} longitude - Target longitude in decimal degrees.
     * @param {number} latitude - Target latitude in decimal degrees.
     * @param {number} altitude - Camera height in meters.
     * @param {number} [duration=2.0] - The flight duration in seconds.
     * @returns {void}
     */
    flyTo(longitude, latitude, altitude, duration = 2.0) {
        return this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
            duration: duration,
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(this.config.camera.defaultPitch),
                roll: 0.0,
            },
        });
    }

    /**
     * Rotates the camera to point directly at a target Cartesian position.
     * @param {Cesium.Cartesian3} targetPosition - The 3D coordinate to focus on.
     * @returns {void}
     */
    lookAtTarget(targetPosition) {
        const camera = this.viewer.camera;

        const direction = Cesium.Cartesian3.subtract(targetPosition, camera.position, new Cesium.Cartesian3());
        Cesium.Cartesian3.normalize(direction, direction);

        camera.setView({
            orientation: {
                direction: direction,
                up: Cesium.Cartesian3.normalize(camera.position, new Cesium.Cartesian3()),
            },
        });
    }

    /**
     * Enforces camera safety limits to prevent "flipping" and gimbal lock.
     * @private
     * @returns {void}
     */
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
