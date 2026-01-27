const OPENSKY_INDEX = {
    ID: 0,
    LONGITUDE: 5,
    LATITUDE: 6,
    ALTITUDE: 7,
    SPEED: 9,
    HEADING: 10
};

export const normalizePlaneData = (apiResponse) => {
    try {
        if (!apiResponse?.states) return [];

        return apiResponse.states
            .map((plane) => {
                const latitude = plane[OPENSKY_INDEX.LATITUDE];
                const longitude = plane[OPENSKY_INDEX.LONGITUDE];

                if (latitude === null || longitude === null) return null;

                return {
                    id: plane[OPENSKY_INDEX.ID],
                    latitude: latitude,
                    longitude: longitude,
                    altitudeInMeters: plane[OPENSKY_INDEX.ALTITUDE] ?? 0,
                    speedInMetersPerSecond: plane[OPENSKY_INDEX.SPEED] ?? 0,
                    headingInDegrees: plane[OPENSKY_INDEX.HEADING] ?? 0
                };
            })
            .filter((plane) => plane !== null);
    } catch (error) {
        console.error("Erreur lors de la normalisation :", error);
        return [];
    }
};