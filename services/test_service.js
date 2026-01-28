const LATITUDE_LONGITUDE_MOVEMENT_STEP = 0.0001;

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


export const moveMockPlane = (plane, targetLatitude, targetLongitude) => {
    const latitudeDirection = targetLatitude > plane.latitude ? 1 : -1;
    const longitudeDirection = targetLongitude > plane.longitude ? 1 : -1;

    return {
        ...plane,
        latitude: plane.latitude + (LATITUDE_LONGITUDE_MOVEMENT_STEP * latitudeDirection),
        longitude: plane.longitude + (LATITUDE_LONGITUDE_MOVEMENT_STEP * longitudeDirection)
    };
};