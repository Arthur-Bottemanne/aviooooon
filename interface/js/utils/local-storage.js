export function loadSavedPosition() {
    const savedData = localStorage.getItem('positionConfig');

    if (savedData) {
        const config = JSON.parse(savedData);
        
        console.log("Retrieved data:", config);

        return config;
    }
}