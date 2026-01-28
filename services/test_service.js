export const createMockCollisionPlane = (targetLatitude, targetLongitude) => {
    const startingLatitude = targetLatitude + 0.05;
    const startingLongitude = targetLongitude + 0.05;

    return {
        id: "TEST-MODE-PLANE-SIMULATION",
        latitude: startingLatitude,
        longitude: startingLongitude,
        altitudeInMeters: 1500,
        speedInMetersPerSecond: 200,
        headingInDegrees: 225,
        isTestModeActive: true
    };
};
export const moveMockPlane = (plane) => {
    const movementConstant = 0.0001; 

    return {
        ...plane,
        latitude: plane.latitude - movementConstant,
        longitude: plane.longitude - movementConstant
    };
};