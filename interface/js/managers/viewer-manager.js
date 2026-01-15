import { CESIUM_CONFIG } from "../config/cesium-config.js";
import * as Cesium from "cesium";

export class ViewerManager {
    constructor(containerId) {
        this.containerId = containerId;
        this.viewer = null;
    }

    initialize() {
        if (this.viewer) {
            console.warn("Viewer already initialized");
            return this.viewer;
        }

        Cesium.Ion.defaultAccessToken = CESIUM_CONFIG.ion.defaultAccessToken;

        this.viewer = new Cesium.Viewer(this.containerId, {
            ...CESIUM_CONFIG.viewer,
            terrainProvider: Cesium.createWorldTerrain(CESIUM_CONFIG.terrain),
        });

        this._setupScene();
        return this.viewer;
    }

    _setupScene() {
        this.viewer.scene.globe.enableLighting = true;
        this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
    }

    getViewer() {
        if (!this.viewer) {
            throw new Error("Viewer not initialized. Call initialize() first.");
        }
        return this.viewer;
    }

    destroy() {
        if (this.viewer) {
            this.viewer.destroy();
            this.viewer = null;
        }
    }
}
