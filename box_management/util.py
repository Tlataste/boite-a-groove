import re


def normalize_string(input_string):
    # Remove special characters and convert to lowercase
    normalized_string = re.sub(r'[^a-zA-Z0-9\s]', '', input_string).lower()
    # Replace multiple spaces with a single space
    normalized_string = re.sub(r'\s+', ' ', normalized_string).strip()
    return normalized_string


def calculate_distance(lat1, lon1, lat2, lon2):
    # Calculer la distance entre deux points géographiques (par exemple, distance haversine)
    # Implémentez votre propre logique de calcul de distance ou utilisez une bibliothèque existante
    # Voici un exemple de calcul de distance haversine simplifié :
    from math import radians, sin, cos, sqrt, atan2

    # Convertir les coordonnées en radians
    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    # Rayon de la Terre en mètres
    R = 6371000

    # Différence de latitude et de longitude
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # Formule de la distance haversine
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c

    return distance
