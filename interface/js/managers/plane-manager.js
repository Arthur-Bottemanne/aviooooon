import * as Cesium from "cesium";

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
        }, 5000);
    }

    /**
     * Stops the plane tracking polling and removes all plane entities from the scene.
     */
    stopTracking() {
        this.planeService.stopPolling();

        for (const id of this.trackedPlaneIds) {
            this.entityManager.remove(id);
        }
        this.trackedPlaneIds.clear();
    }

    /**
     * Fetches data and synchronizes the scene entities (Create, Update, Delete).
     * @private
     */
    async _updatePlanes(latitude, longitude, radius) {
        const planes = await this.planeService.fetchPlaneData(latitude, longitude, radius);
        const fetchedIds = new Set();

        for (const plane of planes) {
            fetchedIds.add(plane.id);
            this._renderPlane(plane);
        }

        for (const id of this.trackedPlaneIds) {
            if (!fetchedIds.has(id)) {
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
    _renderPlane(plane) {
        const position = Cesium.Cartesian3.fromDegrees(
            plane.longitude,
            plane.latitude,
            plane.altitude || 10000,
        );

        const heading = Cesium.Math.toRadians(plane.heading || 0);
        const pitch = 0;
        const roll = 0;
        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

        const description = this._buildDescription(plane);

        if (this.trackedPlaneIds.has(plane.id)) {
            this.entityManager.update(plane.id, {
                position: position,
                orientation: orientation,
                description: description,
            });
        } else {
            this.entityManager.add(plane.id, {
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
                    text: `✈ ${plane.callsign || plane.id}`,
                    font: "14px monospace",
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -20),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 500000),
                },
            });

            this.trackedPlaneIds.add(plane.id);
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
                    <tr><th>Altitude</th><td>${plane.altitude ? Math.round(plane.altitude) + " m" : "N/A"}</td></tr>
                    <tr><th>Velocity</th><td>${plane.velocity ? Math.round(plane.velocity) + " km/h" : "N/A"}</td></tr>
                    <tr><th>Heading</th><td>${plane.heading ? Math.round(plane.heading) + "°" : "N/A"}</td></tr>
                    <tr><th>Country</th><td>${plane.origin_country || "Unknown"}</td></tr>
                </tbody>
            </table>
        `;
    }
}
