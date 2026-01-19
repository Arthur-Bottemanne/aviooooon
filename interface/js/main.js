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

        this.observerLocation = {
            latitude: 46.5197,
            longitude: 6.6323,
            altitude: 495,
        };
    }

    async initialize() {
        try {
            this.viewerManager = new ViewerManager("cesiumContainer");
            const viewer = await this.viewerManager.initialize();

            this.entityManager = new EntityManager(viewer);
            this.cameraManager = new CameraManager(viewer);

            //this.cameraManager.setViewpoint(this.observerLocation.longitude, this.observerLocation.latitude, 1000);

            this.entityManager.addMoon();

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
