import { Cesium } from "cesium";

export class EntityManager {
    constructor(viewer) {
        this.viewer = viewer;
        this.entities = new Map(); // Track entities by ID
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

    addMoon(position) {
        return this.viewer.entities.add({
            id: "moon",
            position: position,
            billboard: {
                image: "assets/moon.png",
                scale: 2.0,
            },
        });
    }

    clear() {
        this.viewer.entities.removeAll();
        this.entities.clear();
    }
}
