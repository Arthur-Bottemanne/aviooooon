import { TimeUtils } from '../utils/time-utils.js';
import { Position } from '../models/position.js';
import * as Cesium from "cesium";

export class MoonService {
  /**
   * Calculate moon position for given observer location and time
   * Uses simplified astronomical calculations
   */
  async getMoonPosition(latitude, longitude, date = new Date()) {
    // Option 1: Use Cesium's built-in sun/moon positioning
    const julianDate = Cesium.JulianDate.fromDate(date);
    const moonPosition = Cesium.Simon1994PlanetaryPositions.computeMoonPositionInEarthInertialFrame(julianDate);
    
    // Transform to Earth-fixed frame
    const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(julianDate);
    const moonPositionFixed = Cesium.Matrix3.multiplyByVector(
      icrfToFixed,
      moonPosition,
      new Cesium.Cartesian3()
    );

    return moonPositionFixed;
  }

  /**
   * Get moon position as azimuth/elevation from observer
   */
  getMoonAzElPosition(latitude, longitude, altitude, date = new Date()) {
    const observerPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude);
    const julianDate = Cesium.JulianDate.fromDate(date);
    
    // Get moon position
    const moonPosition = Cesium.Simon1994PlanetaryPositions.computeMoonPositionInEarthInertialFrame(julianDate);
    const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(julianDate);
    const moonPositionFixed = Cesium.Matrix3.multiplyByVector(
      icrfToFixed,
      moonPosition,
      new Cesium.Cartesian3()
    );

    // Calculate direction from observer to moon
    const direction = Cesium.Cartesian3.subtract(
      moonPositionFixed,
      observerPosition,
      new Cesium.Cartesian3()
    );
    Cesium.Cartesian3.normalize(direction, direction);

    // Transform to ENU frame to get azimuth/elevation
    const enuTransform = Cesium.Transforms.eastNorthUpToFixedFrame(observerPosition);
    const inverseTransform = Cesium.Matrix4.inverse(enuTransform, new Cesium.Matrix4());
    const directionENU = Cesium.Matrix4.multiplyByPointAsVector(
      inverseTransform,
      direction,
      new Cesium.Cartesian3()
    );

    const azimuth = Cesium.Math.toDegrees(Math.atan2(directionENU.x, directionENU.y));
    const elevation = Cesium.Math.toDegrees(Math.asin(directionENU.z));

    return new Position(
      azimuth < 0 ? azimuth + 360 : azimuth,
      elevation,
      Cesium.Cartesian3.distance(observerPosition, moonPositionFixed)
    );
  }

  /**
   * Get moon phase for a given date
   * Returns value between 0 (new moon) and 1 (full moon)
   */
  getMoonPhase(date = new Date()) {
    const julianDate = TimeUtils.toJulianDate(date);
    
    // Simplified moon phase calculation
    // Days since known new moon (Jan 6, 2000)
    const knownNewMoon = 2451550.1;
    const synodicMonth = 29.53058867; // Average length of lunar month
    
    const daysSinceNewMoon = julianDate - knownNewMoon;
    const phase = (daysSinceNewMoon % synodicMonth) / synodicMonth;
    
    return phase;
  }
}