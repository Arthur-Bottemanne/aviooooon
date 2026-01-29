import * as Cesium from "cesium";
import { CESIUM_CONFIG } from "./config/cesium-config.js";
import { loadSavedPosition } from "./utils/local-storage.js";
import { ViewerManager } from "./managers/viewer-manager.js";
import { EntityManager } from "./managers/entity-manager.js";
import { CameraManager } from "./managers/camera-manager.js";
import { MoonManager } from "./managers/moon-manager.js";
import { MoonService } from "./services/moon-service.js";

import { createMockCollisionPlane, moveMockPlane, isCollisionPredicted } from "../../services/test_service.js";

class Application {
    constructor() {
        this.managers = {};
        this.moonService = new MoonService();
        this.observerLocation = null;
        this.testPlane = null;
        this.testInterval = null;
    }

    async initialize() {
        try {
            this.observerLocation = this._getInitialLocation();
            
            const viewer = await this._setupViewer();
            this._setupManagers(viewer);
            
            await this._runInitialSequence();

            this.startCollisionTest();

            console.log("Application initialized successfully with Test Mode");
        } catch (error) {
            console.error("Failed to initialize application:", error);
            this.cleanup();
            throw error;
        }
    }

    startCollisionTest() {
        const { latitude, longitude } = this.observerLocation;
        
        this.testPlane = createMockCollisionPlane(latitude, longitude);

        this.testInterval = setInterval(() => {
            this.testPlane = moveMockPlane(this.testPlane, latitude, longitude);

            if (this.managers.entity) {
                this.managers.entity.updatePlanePosition(this.testPlane.id, this.testPlane);
            }

            this._updateAlertUI();
        }, 1000);
    }

    _updateAlertUI() {
        const banner = document.getElementById('collision-banner');
        const { latitude, longitude } = this.observerLocation;

        if (!banner) return;

        if (isCollisionPredicted(this.testPlane, latitude, longitude)) {
            banner.classList.remove('hidden-alert');
            banner.classList.add('visible-alert');
        } else {
            banner.classList.add('hidden-alert');
            banner.classList.remove('visible-alert');
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
            altitude: config.altitude || 0,
        };
    }

    async _setupViewer() {
        this.managers.viewer = new ViewerManager("cesiumContainer", CESIUM_CONFIG);
        return await this.managers.viewer.initialize();
    }

    _setupManagers(viewer) {
        this.managers.entity = new EntityManager(viewer);
        this.managers.camera = new CameraManager(viewer, CESIUM_CONFIG);
        this.managers.moon   = new MoonManager(this.managers.entity, this.moonService);
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
    }

    cleanup() {
        if (this.testInterval) clearInterval(this.testInterval);
        if (this.managers.viewer) {
            this.managers.viewer.destroy();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new Application();
    app.initialize().catch(error => {
        alert("Failed to load map: " + error.message);
    });
    window.addEventListener("beforeunload", () => app.cleanup());
});