import * as Cesium from "cesium";
import { loadSavedPosition } from "../utils/local-storage";
import { CoordinateUtils } from "../utils/coordinates";

export class PlaneManager {
    constructor(entityManager, planeService) {
        this.entityManager = entityManager;
        this.planeService = planeService;
        this.modelUrl = "/interface/assets/models/plane.glb";
        this.trackedPlaneIds = new Set();
    }

    /**
     * Starts tracking planes within a specific radius of the user.
     * Sets up the polling interval via the PlaneService.
     *
     * @param {number} latitude - Observer's latitude in decimal degrees.
     * @param {number} longitude - Observer's longitude in decimal degrees.
     * @param {number} radius - Search radius in kilometers.
     * @returns {Promise<void>}
     */
    async startTracking(latitude, longitude, radius) {
        await this._updatePlanes(latitude, longitude, radius);

        this.planeService.startPolling(async () => {
            await this._updatePlanes(latitude, longitude, radius);
        });
    }

    /**
     * Stops the plane tracking polling and removes all plane entities from the scene.
     */
    stopTracking() {
        this.planeService.stopPolling();
        this.trackedPlaneIds.forEach((id) => this.entityManager.remove(id));
        this.trackedPlaneIds.clear();
    }

    /**
     * Fetches data and synchronizes the scene entities (Create, Update, Delete).
     * @private
     */
    async _updatePlanes(latitude, longitude, radius) {
        const planes = await this.planeService.fetchPlaneData(latitude, longitude, radius);

        const currentBatchIds = new Set();

        for (const plane of planes) {
            const uniqueId = String(plane.callsign);
            currentBatchIds.add(uniqueId);
            this._renderPlane(plane, uniqueId);
        }

        for (const id of this.trackedPlaneIds) {
            if (!currentBatchIds.has(id)) {
                this.entityManager.remove(id);
                this.trackedPlaneIds.delete(id);
            }
        }
    }

    /**
     * Creates or updates a specific plane entity.
     * @private
     * @param {Object} plane - The plane data object.
     */
    _renderPlane(plane, uniqueId) {
        const observer = loadSavedPosition();

        if (!observer?.latitude || !observer?.longitude) {
            console.error("Observer position missing.");
            return;
        }

        const range = plane.range || 100000;

        const position = CoordinateUtils.azimuthElevationToCartesian(
            observer.latitude,
            observer.longitude,
            observer.altitude || 0,
            plane.azimuth,
            plane.elevation,
            range,
        );

        const heading = Cesium.Math.toRadians(plane.heading || 0);
        const hpr = new Cesium.HeadingPitchRoll(heading, 0, 0);
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

        const description = this._buildDescription(plane);

        if (this.trackedPlaneIds.has(uniqueId)) {
            this.entityManager.update(uniqueId, {
                position: position,
                orientation: orientation,
                description: description,
            });
        } else {
            this.entityManager.add(uniqueId, {
                name: `Flight ${plane.callsign || "Unknown"}`,
                position: position,
                orientation: orientation,
                description: description,
                model: {
                    uri: this.modelUrl,
                    minimumPixelSize: 64,
                    maximumScale: 200,
                    runAnimations: true,
                },
                label: {
                    text: `✈ ${plane.callsign || uniqueId}`,
                    font: "14px monospace",
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    pixelOffset: new Cesium.Cartesian2(0, -20),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
            });
            this.trackedPlaneIds.add(uniqueId);
        }
    }

    /**
     * Generates HTML description for the InfoBox.
     * @private
     * @param {Object} plane
     * @returns {string} HTML string
     */
    _buildDescription(plane) {
        return `
            <table class="cesium-infoBox-defaultTable">
                <tbody>
                    <tr><th>Callsign</th><td>${plane.callsign || "N/A"}</td></tr>
                    <tr><th>Velocity</th><td>${plane.speed ? Math.round(plane.speed) + " m/s" : "N/A"}</td></tr>
                    <tr><th>Heading</th><td>${plane.heading ? Math.round(plane.heading) + "°" : "N/A"}</td></tr>
                </tbody>
            </table>
        `;
    }
}
