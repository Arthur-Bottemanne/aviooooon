import * as Cesium from "cesium";

export class ViewerManager {
    constructor(containerId, config) {
        this.containerId = containerId;
        this.viewer = null;
        this.config = config;
    }

    /**
     * Initializes the Cesium Viewer with Ion credentials and terrain providers.
     *
     * Implements a fallback mechanism to initialize without terrain if the Ion asset fails to load.
     * @returns {Promise<Cesium.Viewer>} A promise that resolves to the initialized Cesium Viewer instance.
     */
    async initialize() {
        if (this.viewer) {
            console.warn("Viewer already initialized");
            return this.viewer;
        }

        Cesium.Ion.defaultAccessToken = this.config.ion.defaultAccessToken;

        try {
            const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(1);

            this.viewer = new Cesium.Viewer(this.containerId, {
                ...this.config.viewer,
                terrainProvider: terrainProvider,
            });

            this._setupScene();

            return this.viewer;
        } catch (error) {
            console.error("Failed to initialize Cesium Terrain:", error);

            this.viewer = new Cesium.Viewer(this.containerId, {
                ...this.config.viewer,
            });

            this._setupScene();

            return this.viewer;
        }
    }

    /**
     * Configures internal scene settings, including lighting, camera collision,
     * and frustum limits for large-scale rendering.
     * @private
     * @returns {void}
     */
    _setupScene() {
        const scene = this.viewer.scene;

        scene.globe.enableLighting = true;
        scene.screenSpaceCameraController.enableCollisionDetection = false;

        // Adjusting frustum for astronomical scales to prevent far-plane clipping
        scene.farToNearRatio = 1000000;
        scene.camera.frustum.far = 1e12;

        scene.globe.depthTestAgainstTerrain = true;
        scene.backgroundColor = Cesium.Color.BLACK;

        // Cleanup default moon to prevent rendering conflicts with custom lunar data
        scene.moon = scene.moon && scene.moon.destroy();
        scene.fog.enabled = false;
    }

    /**
     * Properly disposes of the Cesium Viewer and clears the reference.
     * @returns {void}
     */
    destroy() {
        if (this.viewer) {
            this.viewer.destroy();
            this.viewer = null;
        }
    }
}
