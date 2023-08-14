import re
from math import radians, sin, cos, sqrt, atan2


def normalize_string(input_string):
    """
    Function goal: Normalize a string by removing special characters and converting it to lowercase.

    Args:
        input_string: the string to normalize

    Returns:
        normalized_string: the normalized string
    """
    # Remove special characters and convert to lowercase
    normalized_string = re.sub(r'[^a-zA-Z0-9\s]', '', input_string).lower()
    # Replace multiple spaces with a single space
    normalized_string = re.sub(r'\s+', ' ', normalized_string).strip()
    return normalized_string


def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Function goal: Calculate the distance between two geographical points (using haversine distance)

    Args:
        lat1: the latitude of the first point
        lon1: the longitude of the first point
        lat2: the latitude of the second point
        lon2: the longitude of the second point

    Returns:
        distance: the distance between the two points in meters

    """

    # Convert the coordinates to radians
    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    # Radius of the Earth in meters
    r = 6371000

    # Latitude and longitude differences
    d_lat = lat2 - lat1
    d_lon = lon2 - lon1

    # Haversine formula
    a = sin(d_lat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(d_lon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = r * c

    return distance
