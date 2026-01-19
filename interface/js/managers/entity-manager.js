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
        const moonData = await this.moonService.getMoonData();
        console.log("moon data", moonData);
        const position = Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 50000000);
        const heading = Cesium.Math.toRadians(135);
        const pitch = 0;
        const roll = 0;
        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

        this.moonEntity = this.viewer.entities.add({
            name: "moon",
            position: position,
            orientation: orientation,
            model: {
                uri: "",
                minimumPixelSize: 128,
                maximumScale: 20000,
            },
        });
        this.viewer.trackedEntity = this.moonEntity;
    }

    /**
     * Adds or updates the moon using procedural graphics (no images)
     * @param {Object} moonData - { cartesian, azimuth, elevation, phase }
     */
    updateMoon(moonData) {}

    /**
     * Converts a 0.0-1.0 phase value to a human-readable string
     */
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
