import math

def get_bounding_box(latitude,longitude,radius_km):
    # Constant: 1 degree of latitude ≈ 111.1 km
    KM_PER_DEGREE_LATITUDE = 111.1

    latitude_delta = radius_km / KM_PER_DEGREE_LATITUDE

    # Longitude depends on latitude for accuracy
    km_per_degree_longitude = KM_PER_DEGREE_LATITUDE * math.cos(math.radians(latitude))
    longitude_delta = radius_km / km_per_degree_longitude


    return {
        "lamin": latitude - latitude_delta,
        "lomin": longitude - longitude_delta,
        "lamax": latitude + latitude_delta,
        "lomax": longitude + longitude_delta,
    }