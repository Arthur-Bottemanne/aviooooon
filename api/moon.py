from skyfield.api import Topos,Loader
from skyfield.almanac import phase_angle
from math import cos,radians
from datetime import datetime


load_data = Loader('data')
# Load ephemeris DE421 (model NASA)
#This file contains the precise positions of the stars from 1900 to 2050.
planetary_data = load_data('de421.bsp')
moon = planetary_data['moon']
earth = planetary_data['earth']
sun = planetary_data["sun"]


def compute_moon_position(latitude: float, longitude: float, date_utc: datetime):
    time_scale = load_data.timescale()
    astronomical_time = time_scale.utc(
        date_utc.year,
        date_utc.month,
        date_utc.day,
        date_utc.hour,
        date_utc.minute,
        date_utc.second,
    )

    # Position of the observer on Earth
    observer = earth + Topos(latitude_degrees=latitude, longitude_degrees=longitude)

    # Moon observation (Apparent position for Azimut/Altitude)
    astrometric = observer.at(astronomical_time).observe(moon)
    altitude, azimut, distance = astrometric.apparent().altaz()

    # Moon phase (illumination)
    moon_phase_angle = phase_angle(planetary_data, 'moon', astronomical_time)
    illumination = (1.0 + cos(radians(moon_phase_angle.degrees))) / 2.0

    return {
        "azimuth": float(round(azimut.degrees, 2)),
        "elevation": float(round(altitude.degrees, 2)),
        "phase": float(round(illumination, 3)),
    }

