import { Cesium } from "cesium";

export class TimeUtils {
    /**
     * Convert JavaScript Date to Julian Date
     */
    static toJulianDate(date = new Date()) {
        const time = date.getTime();
        return time / 86400000 + 2440587.5;
    }

    /**
     * Convert Julian Date to JavaScript Date
     */
    static fromJulianDate(jd) {
        return new Date((jd - 2440587.5) * 86400000);
    }

    /**
     * Get current time as Cesium JulianDate
     */
    static getCurrentJulianDate() {
        return Cesium.JulianDate.now();
    }

    /**
     * Convert Date to Cesium JulianDate
     */
    static toCesiumJulianDate(date = new Date()) {
        return Cesium.JulianDate.fromDate(date);
    }

    /**
     * Add seconds to a date
     */
    static addSeconds(date, seconds) {
        return new Date(date.getTime() + seconds * 1000);
    }

    /**
     * Add minutes to a date
     */
    static addMinutes(date, minutes) {
        return this.addSeconds(date, minutes * 60);
    }

    /**
     * Add hours to a date
     */
    static addHours(date, hours) {
        return this.addMinutes(date, hours * 60);
    }

    /**
     * Get UTC timestamp in seconds
     */
    static getUtcTimestamp(date = new Date()) {
        return Math.floor(date.getTime() / 1000);
    }

    /**
     * Format date for display
     */
    static formatDateTime(date = new Date(), includeSeconds = false) {
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            ...(includeSeconds && { second: "2-digit" }),
        };
        return date.toLocaleString("en-US", options);
    }

    /**
     * Format time only
     */
    static formatTime(date = new Date(), includeSeconds = false) {
        const options = {
            hour: "2-digit",
            minute: "2-digit",
            ...(includeSeconds && { second: "2-digit" }),
        };
        return date.toLocaleTimeString("en-US", options);
    }

    /**
     * Get time difference in seconds
     */
    static diffInSeconds(date1, date2) {
        return Math.abs(date1.getTime() - date2.getTime()) / 1000;
    }

    /**
     * Check if date is today
     */
    static isToday(date) {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }

    /**
     * Get solar time (local solar time at given longitude)
     */
    static getSolarTime(date, longitude) {
        const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;
        const solarHours = utcHours + longitude / 15; // 15 degrees per hour
        const normalized = ((solarHours % 24) + 24) % 24;

        const hours = Math.floor(normalized);
        const minutes = Math.floor((normalized - hours) * 60);

        return { hours, minutes };
    }

    /**
     * Calculate day of year (1-366)
     */
    static getDayOfYear(date = new Date()) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    /**
     * Create time range generator
     */
    static *timeRange(startDate, endDate, intervalSeconds) {
        let current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {
            yield new Date(current);
            current = this.addSeconds(current, intervalSeconds);
        }
    }

    /**
     * Get time until next update (useful for scheduling)
     */
    static getMillisecondsUntilNextInterval(intervalSeconds) {
        const now = new Date();
        const secondsIntoInterval = now.getSeconds() % intervalSeconds;
        const secondsUntilNext = intervalSeconds - secondsIntoInterval;
        return secondsUntilNext * 1000 - now.getMilliseconds();
    }

    /**
     * Parse ISO 8601 string safely
     */
    static parseIsoString(isoString) {
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) {
                throw new Error("Invalid date");
            }
            return date;
        } catch (error) {
            console.error("Failed to parse date:", isoString, error);
            return null;
        }
    }
}
