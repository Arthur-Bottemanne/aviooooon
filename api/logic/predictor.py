import math

def predict_future_position(latitude, longitude, altitude,velocity,heading,vertical_rate,seconds=30):

    future_altitude = altitude + (vertical_rate * seconds)

    distance_metre =velocity * seconds
    earth_radius = 6371000

    heading_radians = math.radians(heading)

    future_altitude = latitude + math.degrees((distance_metre * math.cos(heading_radians)) / earth_radius)

    future_longitude = longitude + math.degrees((distance_metre * math.sin(heading_radians)) / (earth_radius * math.cos(math.radians(latitude))))

    return future_altitude, future_longitude, future_altitude
