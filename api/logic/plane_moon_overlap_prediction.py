import math

def predict_future_position(latitude, longitude, altitude,velocity,heading,vertical_rate,seconds=30):

    future_altitude = altitude + (vertical_rate * seconds)

    distance_metre =velocity * seconds
    earth_radius = 6371000

    heading_radians = math.radians(heading)

    future_latitude = latitude + math.degrees((distance_metre * math.cos(heading_radians)) / earth_radius)

    future_longitude = longitude + math.degrees((distance_metre * math.sin(heading_radians)) / (earth_radius * math.cos(math.radians(latitude))))

    return future_latitude, future_longitude, future_altitude


def calculate_will_intersect(future_azimuth,moon_azimuth,future_elevation,moon_elevation,threshold=0.35):

    distance = math.sqrt((future_azimuth - moon_azimuth)**2 + (future_elevation - moon_elevation)**2)

    return distance <= threshold