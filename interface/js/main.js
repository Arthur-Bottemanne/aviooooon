import * as Cesium from "cesium";
import { loadSavedPosition } from "./utils/local-storage.js";
import { ViewerManager } from "./managers/viewer-manager.js";
import { EntityManager } from "./managers/entity-manager.js";
import { CameraManager } from "./managers/camera-manager.js";
import { AircraftService } from "./services/aircraft-service.js";

class Application {
    constructor() {
        this.viewerManager = null;
        this.entityManager = null;
        this.cameraManager = null;
        this.aircraftService = new AircraftService();

        const config = loadSavedPosition()

        if (!config) {
             console.log("Must have position defined!")
             return
        }

        this.observerLocation = {
            latitude: config.latitude,
            longitude: config.longitude,
            altitude: config.altitude,
        };
    }

    async initialize() {
        try {
            this.viewerManager = new ViewerManager("cesiumContainer");
            const viewer = await this.viewerManager.initialize();

            viewer.scene.fog.enabled = false;

            this.entityManager = new EntityManager(viewer);
            this.cameraManager = new CameraManager(viewer);

            const cameraOrientation = {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(0),
                roll: 0.0,
            };

            this.cameraManager.setViewpoint(
                this.observerLocation.longitude,
                this.observerLocation.latitude,
                this.observerLocation.altitude,
                cameraOrientation
            );

            const moonPosition = await this.entityManager.addMoon();

            this.cameraManager.lookAtTarget(moonPosition);

            await this.updateAircraft();
            this.aircraftService.startPolling(() => this.updateAircraft(), 30000);

            console.log("Application initialized successfully");
        } catch (error) {
            console.error("Failed to initialize application:", error);
            throw error;
        }
    }

    async updateAircraft() {
        const aircraft = await this.aircraftService.fetchAircraftData(
            this.observerLocation.latitude,
            this.observerLocation.longitude,
            100
        );

        aircraft.forEach((plane) => {
            this.entityManager.updateAircraft(plane);
        });
    }

    cleanup() {
        this.aircraftService.stopPolling();
        this.viewerManager.destroy();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new Application();
    app.initialize().catch(console.error);

    window.addEventListener("beforeunload", () => app.cleanup());
});
