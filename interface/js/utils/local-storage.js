/**
 * Retrieves the values in the local storage if they are set.
 */
export function loadSavedPosition() {
    const savedData = localStorage.getItem("positionConfig");

    if (savedData) {
        const config = JSON.parse(savedData);

        return config;
    }
}
