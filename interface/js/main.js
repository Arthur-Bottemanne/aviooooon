import * as Cesium from "cesium";
import { CESIUM_CONFIG } from "./config/cesium-config.js";
import { loadSavedPosition } from "./utils/local-storage.js";
import { ViewerManager } from "./managers/viewer-manager.js";
import { EntityManager } from "./managers/entity-manager.js";
import { CameraManager } from "./managers/camera-manager.js";
import { MoonManager } from "./managers/moon-manager.js";
import { PlaneManager } from "./managers/plane-manager.js";
import { MoonService } from "./services/moon-service.js";
import { PlaneService } from "./services/plane-service.js";

class Application {
    constructor() {
        this.managers = {};
        this.moonService = new MoonService();
        this.PlaneService = new PlaneService();
        this.observerLocation = null;
        this.radius = 100;
    }

    async initialize() {
        try {
            this.observerLocation = this._getInitialLocation();

            const viewer = await this._setupViewer();
            this._setupManagers(viewer);

            await this._runInitialSequence();

            console.log("Application initialized successfully");
        } catch (error) {
            console.error("Failed to initialize application:", error);

            this.cleanup();
            throw error;
        }
    }

    _getInitialLocation() {
        const config = loadSavedPosition();
        if (!config) {
            throw new Error("Initialization aborted: No observer position defined in local storage.");
        }
        return {
            latitude: config.latitude,
            longitude: config.longitude,
            altitude: config.altitude,
        };
    }

    async _setupViewer() {
        this.managers.viewer = new ViewerManager("cesiumContainer", CESIUM_CONFIG);
        return await this.managers.viewer.initialize();
    }

    _setupManagers(viewer) {
        this.managers.entity = new EntityManager(viewer);
        this.managers.camera = new CameraManager(viewer, CESIUM_CONFIG);
        this.managers.moon = new MoonManager(this.managers.entity, this.moonService);
        this.managers.plane = new PlaneManager(this.managers.entity, this.PlaneService);
    }

    async _runInitialSequence() {
        const { latitude, longitude, altitude } = this.observerLocation;

        const defaultOrientation = {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(0),
            roll: 0.0,
        };

        this.managers.camera.setViewpoint(longitude, latitude, altitude, defaultOrientation);

        const moonPosition = await this.managers.moon.spawnMoon(latitude, longitude, altitude);
        this.managers.camera.lookAtTarget(moonPosition);

        await this.managers.plane.startTracking(latitude, longitude, this.radius);
    }

    cleanup() {
        if (this.managers.viewer) {
            this.managers.viewer.destroy();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new Application();
    app.initialize().catch((error) => {
        alert("Failed to load map: " + error.message);
    });

    window.addEventListener("beforeunload", () => app.cleanup());
});
