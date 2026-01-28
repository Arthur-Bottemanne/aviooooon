export const CESIUM_CONFIG = {
    ion: {
        defaultAccessToken: import.meta.env.VITE_CESIUM_TOKEN,
    },
    viewer: {
        animation: false,
        timeline: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: true,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        shouldAnimate: true,
    },
    terrain: {
        requestWaterMask: true,
        requestVertexNormals: true,
    },
};

export const API_ENDPOINTS = {
    aircraft: import.meta.env.VITE_BASE_API_URL + "/aircraft",
    moon: import.meta.env.VITE_BASE_API_URL + "/moon",
};
