import * as Cesium from "cesium";
import { MoonService } from "../services/moon-service.js";

export class EntityManager {
    constructor(viewer) {
        this.viewer = viewer;
        this.entities = new Map();
        this.moonModel = "interface/assets/models/moon.glb";
        this.moonService = new MoonService();
    }

    addAircraft(aircraft) {
        const entity = this.viewer.entities.add({
            id: aircraft.id,
            position: aircraft.position,
            billboard: {
                image: aircraft.icon,
                scale: 0.5,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            },
            label: {
                text: aircraft.callsign,
                font: "14px sans-serif",
                pixelOffset: new Cesium.Cartesian2(0, -30),
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            },
        });

        this.entities.set(aircraft.id, entity);
        return entity;
    }

    updateAircraft(aircraft) {
        const entity = this.entities.get(aircraft.id);
        if (entity) {
            entity.position = aircraft.position;
            entity.label.text = aircraft.callsign;
        } else {
            this.addAircraft(aircraft);
        }
    }

    removeAircraft(aircraftId) {
        const entity = this.entities.get(aircraftId);
        if (entity) {
            this.viewer.entities.remove(entity);
            this.entities.delete(aircraftId);
        }
    }

    async addMoon() {
        const moonData = await this.moonService.getMoonData(46.5197, 6.6323, 495);
        const position = new Cesium.Cartesian3(moonData.cartesian.x, moonData.cartesian.y, moonData.cartesian.z);

        const moonEntity = this.viewer.entities.add({
            name: "The Moon",
            position: position,
            description: `
                <table class="cesium-infoBox-defaultTable">
                    <tbody>
                        <tr><th>Parameter</th><th>Value</th></tr>
                        <tr><td>Data A</td><td>${moonData.someValue || "N/A"}</td></tr>
                    </tbody>
                </table>
            `,
            label: {
                text: "● Moon",
                font: "14px monospace",
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                fillColor: Cesium.Color.YELLOW,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                pixelOffset: new Cesium.Cartesian2(-3, 0),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 100000000000.0),
            },
        });

        const heading = Cesium.Math.toRadians(135);
        const pitch = 0;
        const roll = 0;
        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position, hpr);

        const moonModel = await Cesium.Model.fromGltfAsync({
            url: this.moonModel,
            modelMatrix: modelMatrix,
            minimumPixelSize: 2048,
            maximumScale: 3000,
            customShader: new Cesium.CustomShader({
                lightingModel: Cesium.LightingModel.UNLIT,
            }),
            id: moonEntity,
        });

        this.viewer.scene.primitives.add(moonModel);
    }

    _getPhaseName(phase) {
        if (phase <= 0.05 || phase >= 0.95) return "New Moon";
        if (phase > 0.05 && phase < 0.2) return "Waxing Crescent";
        if (phase >= 0.2 && phase <= 0.3) return "First Quarter";
        if (phase > 0.3 && phase < 0.45) return "Waxing Gibbous";
        if (phase >= 0.45 && phase <= 0.55) return "Full Moon";
        if (phase > 0.55 && phase < 0.7) return "Waning Gibbous";
        if (phase >= 0.7 && phase <= 0.8) return "Last Quarter";
        return "Waning Crescent";
    }

    clear() {
        this.viewer.entities.removeAll();
        this.entities.clear();
    }
}
