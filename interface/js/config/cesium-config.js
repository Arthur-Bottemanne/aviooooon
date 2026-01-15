export const CESIUM_CONFIG = {
    ion: {
        defaultAccessToken: process.env.CESIUM_TOKEN,
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
    camera: {
        defaultAltitude: 5000,
        defaultPitch: -45,
    },
};

export const API_ENDPOINTS = {
    aircraft: "https://api.example.com/aircraft",
    moon: "https://api.example.com/moon",
};
