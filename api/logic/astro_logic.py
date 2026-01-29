import math

def calculate_will_intersect(future_azimuth,moon_azimuth,future_elevation,moon_elevation,threshold=0.35):

    distance = math.sqrt((future_azimuth - moon_azimuth)**2 + (future_elevation - moon_elevation)**2)

    return distance <= threshold