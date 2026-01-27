export const normalizePlaneData = (apiResponse) => {
    if (!apiResponse || !apiResponse.states) return [];

    return apiResponse.states
        .map((planeArray) => {
            const latitude = planeArray[6];
            const longitude = planeArray[5];

            if (latitude === null || longitude === null) return null;

            return {
                id: planeArray[0],
                latitude: latitude,
                longitude: longitude,
                altitudeInMeters: planeArray[7] ?? 0,
                speedInMetersPerSecond: planeArray[9] ?? 0,
                headingInDegrees: planeArray[10] ?? 0
            };
        })
        .filter((plane) => plane !== null);
};