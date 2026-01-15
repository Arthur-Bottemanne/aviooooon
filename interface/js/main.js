import { ViewerManager } from "./managers/viewer-manager.js";
import { EntityManager } from "./managers/entity-manager.js";
import { CameraManager } from "./managers/camera-manager.js";
import { AircraftService } from "./services/aircraft-service.js";
import { MoonService } from "./services/moon-service.js";

class Application {
    constructor() {
        this.viewerManager = null;
        this.entityManager = null;
        this.cameraManager = null;
        this.aircraftService = new AircraftService();
        this.moonService = new MoonService();

        this.observerLocation = {
            latitude: 46.5197,
            longitude: 6.6323,
            altitude: 495,
        };
    }

    async initialize() {
        try {
            this.viewerManager = new ViewerManager("cesiumContainer");
            const viewer = this.viewerManager.initialize();

            // Initialize managers
            this.entityManager = new EntityManager(viewer);
            this.cameraManager = new CameraManager(viewer);

            // Set initial camera position
            this.cameraManager.setViewpoint(this.observerLocation.longitude, this.observerLocation.latitude, 5000);

            // Add moon
            await this.updateMoon();

            // Start aircraft updates
            await this.updateAircraft();
            this.aircraftService.startPolling(() => this.updateAircraft(), 5000);

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
            100 // km radius
        );

        aircraft.forEach((plane) => {
            this.entityManager.updateAircraft(plane);
        });
    }

    async updateMoon() {
        const moonPosition = await this.moonService.getMoonPosition(
            this.observerLocation.latitude,
            this.observerLocation.longitude,
            new Date()
        );

        this.entityManager.addMoon(moonPosition);
    }

    cleanup() {
        this.aircraftService.stopPolling();
        this.viewerManager.destroy();
    }
}

// Initialize application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const app = new Application();
    app.initialize().catch(console.error);

    // Cleanup on page unload
    window.addEventListener("beforeunload", () => app.cleanup());
});
