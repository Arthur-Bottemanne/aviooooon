import * as Cesium from "cesium";

export class MoonManager {
    constructor(entityManager, moonService) {
        this.entityManager = entityManager;
        this.moonService = moonService;
        this.modelUrl = "/interface/assets/models/moon.glb";
    }

    /**
     * Fetches lunar data and renders both a label entity and a 3D model primitive in the scene.
     * 
     * Configures the moon with an "unlit" lighting model to ensure visibility against the black of space.
     * @param {number} latitude - Observer's latitude in decimal degrees.
     * @param {number} longitude - Observer's longitude in decimal degrees.
     * @param {number} altitude - Observer's altitude in meters.
     * @returns {Promise<Cesium.Cartesian3>} A promise resolving to the moon's calculated Cartesian position.
     */
    async spawnMoon(latitude, longitude, altitude) {
        const data = await this.moonService.getMoonData(latitude, longitude, altitude);
        const position = new Cesium.Cartesian3(data.cartesian.x, data.cartesian.y, data.cartesian.z);
        const phaseName = await this.moonService.getPhaseName()

        this.entityManager.add("the-moon", {
            name: "The moon",
            position: position,
            description: `
                <table class="cesium-infoBox-defaultTable">
                    <tbody>
                        <tr><th>Parameter</th><th>Value</th></tr>
                        <tr><td>Moon phase</td><td>${phaseName || "N/A"}</td></tr>
                    </tbody>
                </table>
            `,
            label: {
                text: "● Moon",
                font: "20px monospace",
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                fillColor: Cesium.Color.YELLOW,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                pixelOffset: new Cesium.Cartesian2(-3, 0),
                // Ensures the label is visible even when behind the Earth or other distant objects
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                // Pushes the label forward in the eye-coordinate system to prevent z-fighting at space scales
                eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 100000000000.0),
            },
        });

        const model = await Cesium.Model.fromGltfAsync({
            url: this.modelUrl,
            modelMatrix: this._calculateMatrix(position),
            minimumPixelSize: 2048,
            maximumScale: 8000,
            customShader: new Cesium.CustomShader({
                lightingModel: Cesium.LightingModel.UNLIT,
            }),
        });

        this.entityManager.addPrimitive(model);

        return position;
    }

    /**
     * Calculates the transformation matrix for the moon model, applying a fixed 135-degree heading.
     * @private
     * @param {Cesium.Cartesian3} position - The ECEF (Earth-Centered, Earth-Fixed) position for the model.
     * @returns {Cesium.Matrix4} The resulting fixed-frame transformation matrix.
     */
    _calculateMatrix(position) {
        const hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(135), 0, 0);
        return Cesium.Transforms.headingPitchRollToFixedFrame(position, hpr);
    }
}