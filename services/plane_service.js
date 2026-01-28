const OPENSKY_INDEX = {
    ID: 0,
    LONGITUDE: 5,
    LATITUDE: 6,
    ALTITUDE: 7,
    SPEED: 9,
    HEADING: 10
};

export const normalizePlaneData = (apiResponse) => {
    if (!apiResponse?.states) return [];

    try {
        return apiResponse.states.map((plane) => {
            const id = plane[OPENSKY_INDEX.ID];
            const latitude = plane[OPENSKY_INDEX.LATITUDE];
            const longitude = plane[OPENSKY_INDEX.LONGITUDE];
            const altitude = plane[OPENSKY_INDEX.ALTITUDE];
            const speed = plane[OPENSKY_INDEX.SPEED];
            const heading = plane[OPENSKY_INDEX.HEADING];

            if (
                id === null || 
                latitude === null || 
                longitude === null || 
                altitude === null || 
                speed === null || 
                heading === null
            ) {
                throw new Error(`Invalid data: One or more values are null for plane ID: ${id}`);
            }

            return {
                id,
                latitude,
                longitude,
                altitudeInMeters: altitude,
                speedInMetersPerSecond: speed,
                headingInDegrees: heading
            };
        });
    } catch (error) {
        console.error("Normalization error:", error.message);
        throw error; 
    }
};