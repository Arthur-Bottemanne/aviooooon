import * as Cesium from "cesium";

export class EntityManager {
    constructor(viewer) {
        this.viewer = viewer;
        this.entities = new Map();
        this.moonId = "lunar-entity";
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

    /**
     * Adds or updates the moon using procedural graphics (no images)
     * @param {Object} moonData - { cartesian, azimuth, elevation, phase }
     */
    updateMoon(moonData) {
        const phaseName = this._getPhaseName(moonData.phase);
        const entity = this.entities.get(this.moonId);

        if (entity) {
            // Update existing entity
            entity.position = moonData.cartesian;
            entity.label.text = `Moon (${phaseName})\nAz: ${moonData.azimuth.toFixed(1)}°`;
        } else {
            // Create new procedural moon entity
            const newMoon = this.viewer.entities.add({
                id: this.moonId,
                position: moonData.cartesian,
                point: {
                    pixelSize: 50,
                    color: Cesium.Color.fromCssColorString("#fffbe6"),
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
                label: {
                    text: `MOON`,
                    font: "bold 18px sans-serif",
                    fillColor: Cesium.Color.GOLD,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 4,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    distanceDisplayCondition: undefined,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    pixelOffset: new Cesium.Cartesian2(0, -30),
                },
            });
            this.entities.set(this.moonId, newMoon);
        }
    }

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
