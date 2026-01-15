from skyfield.api import Topos,Loader
from skyfield.almanac import phase_angle
from math import cos,radians
from datetime import datetime

#Folder Path
load_data = Loader('data')
# Load ephemeris DE421 (model NASA)
#This file contains the precise positions of the stars from 1900 to 2050.
eph = load_data('de421.bsp')
moon = eph['moon']
earth = eph['earth']
sun = eph["sun"]


def compute_moon_position(lat: float, lon: float, date_utc: datetime):
    ts = load_data.timescale()
    t = ts.utc(
        date_utc.year,
        date_utc.month,
        date_utc.day,
        date_utc.hour,
        date_utc.minute,
        date_utc.second,
    )

    # Position of the observer on Earth
    observer = earth + Topos(latitude_degrees=lat, longitude_degrees=lon)

    # Moon observation (Apparent position for Az/Alt)
    astrometric = observer.at(t).observe(moon)
    alt, az, distance = astrometric.apparent().altaz()

    # Moon phase (illumination)
    phi = phase_angle(eph, 'moon', t)
    illumination = (1.0 + cos(radians(phi.degrees))) / 2.0

    return {
        "azimuth": float(round(az.degrees, 2)),
        "elevation": float(round(alt.degrees, 2)),
        "phase": float(round(illumination, 3)),
    }


# Test Scenario 1 : Standard Calculation
print("Scenario 1: ")
print(compute_moon_position(46.5, 6.5, datetime(2026, 1, 1, 20, 0, 0)))

#Test Scenario 2 : Moon Below horizon
print("Scenario 2: ")
print(compute_moon_position(46.5, 6.5, datetime(2026, 1, 15, 22, 0, 0)))
