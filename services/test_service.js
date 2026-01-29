const METERS_TO_DEGREES_RATIO = 111111;

export const createMockCollisionPlane = (targetLatitude, targetLongitude) => {
    const startingLatitude = targetLatitude + 0.05;
    const startingLongitude = targetLongitude + 0.05;

    return {
        id: "TEST-MODE-PLANE-SIMULATION",
        latitude: startingLatitude,
        longitude: startingLongitude,
        altitudeInMeters: 1500,
        speedInMetersPerSecond: 200, 
        headingInDegrees: 225
        isTestModeActive: true
    };
};


export const moveMockPlane = (plane, targetLatitude, targetLongitude) => {
    const baseStep = plane.speedInMetersPerSecond / METERS_TO_DEGREES_RATIO;

    const longitudeCorrection = Math.cos(plane.latitude * (Math.PI / 180));
    const longitudeStep = baseStep / (longitudeCorrection || 1);

    const latitudeDirection = targetLatitude > plane.latitude ? 1 : -1;
    const longitudeDirection = targetLongitude > plane.longitude ? 1 : -1;

    return {
        ...plane,
        latitude: plane.latitude + (baseStep * latitudeDirection),
        longitude: plane.longitude + (longitudeStep * longitudeDirection)
    };
};

export const isCollisionPredicted = (plane, targetLatitude, targetLongitude) => {
    const latDiff = Math.abs(plane.latitude - targetLatitude);
    const lonDiff = Math.abs(plane.longitude - targetLongitude);
    
    return latDiff < 0.054 && lonDiff < 0.054;
};