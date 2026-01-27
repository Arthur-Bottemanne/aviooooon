export const normalizePlaneData = (apiResponse) => {
    // Étape de base : on vérifie la présence des données
    if (!apiResponse || !apiResponse.states) return [];

    return apiResponse.states.map((planeArray) => {
        return {
            id: planeArray[0],
            lng: planeArray[5],
            lat: planeArray[6],
            alt: planeArray[7],
            speed: planeArray[9],
            heading: planeArray[10]
        };
    });
};