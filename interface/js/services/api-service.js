import { API_ENDPOINTS } from "../config/cesium-config.js";

export class ApiService {
    constructor() {
        this.baseUrl = import.meta.env.VITE_BASE_API_URL;
        this.defaultHeaders = {
            "Content-Type": "application/json",
        };
    }

    async get(endpoint, params = {}, headers = {}) {
        const url = new URL(endpoint, this.baseUrl);

        Object.keys(params).forEach((key) => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });

        try {
            const response = await fetch(url.toString(), {
                method: "GET",
                headers: { ...this.defaultHeaders, ...headers },
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async post(endpoint, data = {}, headers = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: "POST",
                headers: { ...this.defaultHeaders, ...headers },
                body: JSON.stringify(data),
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async handleResponse(response) {
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorBody}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }

        return await response.text();
    }

    handleError(error) {
        if (error.name === "AbortError") {
            return new Error("Request was aborted");
        }

        if (!navigator.onLine) {
            return new Error("No internet connection");
        }

        return error;
    }

    async getWithTimeout(endpoint, params = {}, timeoutMs = 10000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const url = new URL(endpoint, this.baseUrl);
            Object.keys(params).forEach((key) => {
                url.searchParams.append(key, params[key]);
            });

            const response = await fetch(url.toString(), {
                signal: controller.signal,
                headers: this.defaultHeaders,
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw this.handleError(error);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async batchGet(endpoints) {
        try {
            const promises = endpoints.map((endpoint) => this.get(endpoint));
            return await Promise.all(promises);
        } catch (error) {
            console.error("Batch request failed:", error);
            throw error;
        }
    }
}

export class AircraftApiService extends ApiService {
    constructor() {
        super(API_ENDPOINTS.aircraft);
    }

    async getNearbyAircraft(lat, lon, radius = 100) {
        return this.get("", { lat, lon, radius });
    }
}
