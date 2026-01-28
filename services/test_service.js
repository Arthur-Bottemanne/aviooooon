const METERS_TO_DEGREES_RATIO = 111111;

export const createMockCollisionPlane = (targetLatitude, targetLongitude) => {
    const startingLatitude = targetLatitude + 0.05;
    const startingLongitude = targetLongitude + 0.05;

    return {
        id: "TEST-MODE-PLANE-SIMULATION",
        latitude: startingLatitude,
        longitude: startingLongitude,
        altitudeInMeters: 1500,
        speedInMetersPerSecond: 200, // The plane travels 200m every second
        headingInDegrees: 225,
        isTestModeActive: true
    };
};

export const moveMockPlane = (plane, targetLatitude, targetLongitude) => {
    const degreesPerSecond = plane.speedInMetersPerSecond / METERS_TO_DEGREES_RATIO;

    const latitudeDirection = targetLatitude > plane.latitude ? 1 : -1;
    const longitudeDirection = targetLongitude > plane.longitude ? 1 : -1;

    return {
        ...plane,
        latitude: plane.latitude + (degreesPerSecond * latitudeDirection),
        longitude: plane.longitude + (degreesPerSecond * longitudeDirection)
    };
};