export class EntityManager {
    constructor(viewer) {
        this.viewer = viewer;
        this.entities = new Map();
    }

    /**
     * Registers a new high-level Entity with the viewer and tracks it internally.
     * 
     * If an entity with the given ID already exists, the existing instance is returned.
     * @param {string} id - A unique identifier for the entity.
     * @param {Object} options - Cesium Entity options (position, model, label, etc.).
     * @returns {Cesium.Entity} The newly created or existing Cesium Entity.
     */
    add(id, options) {
        if (this.entities.has(id)) return this.entities.get(id);

        const entity = this.viewer.entities.add({ id, ...options });
        this.entities.set(id, entity);
        return entity;
    }

    /**
     * Updates an existing entity's properties using shallow merging.
     * @param {string} id - The unique identifier of the entity to update.
     * @param {Object} updates - An object containing the properties to be updated.
     * @returns {void}
     */
    update(id, updates) {
        const entity = this.entities.get(id);
        if (entity) {
            Object.assign(entity, updates);
        }
    }

    /**
     * Removes an entity from the Cesium viewer and the internal tracking Map.
     * @param {string} id - The unique identifier of the entity to remove.
     * @returns {void}
     */
    remove(id) {
        const entity = this.entities.get(id);
        if (entity) {
            this.viewer.entities.remove(entity);
            this.entities.delete(id);
        }
    }

    /**
     * Adds a low-level Graphic Primitive to the scene. 
     * @param {Cesium.Primitive|Cesium.Model} primitive - The Cesium primitive or model instance to add.
     * @returns {Object} The added primitive.
     */
    addPrimitive(primitive) {
        return this.viewer.scene.primitives.add(primitive);
    }
}