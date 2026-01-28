import math
import os
from skyfield.api import Topos,Loader

current_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(current_dir, '..', 'data')
load_data = Loader(data_path)
planets = load_data('de421.bsp')
earth = planets['earth']
timescale = load_data.timescale()

def convert_plane_to_azimuth_elevation(observateur_latitude,observateur_longitude,plane_latitude,plane_longitude,plane_altitude_metre):

    try:
        if not (-90 <= plane_latitude <= 90) or not (-180 <= plane_longitude <= 180):
            raise ValueError("GPS coordinates out of bounds")


        if plane_altitude_metre is None or plane_altitude_metre <-500:
            raise ValueError("Invalid altitude")

        observer = earth + Topos(latitude_degrees=observateur_latitude,longitude_degrees=observateur_longitude)
        aircraft = earth + Topos(latitude_degrees=plane_latitude,longitude_degrees=plane_longitude,elevation_m=plane_altitude_metre)


        now = timescale.now()
        difference = aircraft - observer
        altitude,azimuth,_ = difference.at(now).altaz()

        return round(azimuth.degrees, 2), round(altitude.degrees, 2)

    except Exception as e:
        raise ValueError(f"Conversion error: {str(e)}")