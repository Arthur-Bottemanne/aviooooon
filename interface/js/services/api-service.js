export class ApiService {
    constructor() {
        this.baseUrl = import.meta.env.VITE_BASE_API_URL;
        this.defaultHeaders = {
            "Content-Type": "application/json",
        };
    }

    /**
     * Performs an asynchronous GET request with query parameters.
     * @param {string} endpoint - The API endpoint relative to the base URL.
     * @param {Object} [params={}] - Key-value pairs to be appended as query strings.
     * @param {Object} [headers={}] - Additional custom headers for this specific request.
     * @returns {Promise<any>} The parsed JSON or text data from the response.
     * @throws {Error} Throws a normalized error if the fetch fails or the response is not "ok".
     */
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

    /**
     * Validates the HTTP response and determines the appropriate parsing method.
     * @param {Response} response - The Fetch API Response object.
     * @returns {Promise<any>} Parsed JSON if the content type matches, otherwise plain text.
     * @throws {Error} Throws an error containing status code and response body if request failed.
     */
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

    /**
     * Normalizes error messages for common failure scenarios (e.g., offline or aborted).
     * @param {Error|any} error - The error caught during the fetch lifecycle.
     * @returns {Error} A standardized Error object.
     */
    handleError(error) {
        if (error.name === "AbortError") {
            return new Error("Request was aborted");
        }

        if (!navigator.onLine) {
            return new Error("No internet connection");
        }

        return error;
    }
}