import { CESIUM_CONFIG } from "../config/cesium-config.js";
import * as Cesium from "cesium";

export class ViewerManager {
    constructor(containerId) {
        this.containerId = containerId;
        this.viewer = null;
    }

    async initialize() {
        if (this.viewer) {
            console.warn("Viewer already initialized");
            return this.viewer;
        }

        Cesium.Ion.defaultAccessToken = CESIUM_CONFIG.ion.defaultAccessToken;

        try {
            const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(1);

            this.viewer = new Cesium.Viewer(this.containerId, {
                ...CESIUM_CONFIG.viewer,
                terrainProvider: terrainProvider,
            });

            this._setupScene();
            return this.viewer;
        } catch (error) {
            console.error("Failed to initialize Cesium Terrain:", error);
            this.viewer = new Cesium.Viewer(this.containerId, {
                ...CESIUM_CONFIG.viewer,
            });
            this._setupScene();
            return this.viewer;
        }
    }

    _setupScene() {
        const scene = this.viewer.scene;
        scene.globe.enableLighting = true;
        scene.screenSpaceCameraController.enableCollisionDetection = false;
        scene.farToNearRatio = 1000000;
        scene.camera.frustum.far = 1e12;
        scene.globe.depthTestAgainstTerrain = false;
        scene.backgroundColor = Cesium.Color.BLACK;
        scene.moon = scene.moon && scene.moon.destroy();
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
