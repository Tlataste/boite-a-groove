from fuzzywuzzy import fuzz


def find_matching_song_from_deezer_to_spotify(deezer_song_name, deezer_song_artist, deezer_song_duration, spotify_song_list):
    best_match = None
    best_match_score = 0

    for spotify_song in spotify_song_list:
        spotify_song_name = spotify_song['name']
        spotify_song_artist = spotify_song['artist']
        spotify_song_duration = spotify_song['duration'] // 1000  # Convertir la durée en secondes

        # Comparaison des noms de chansons
        name_match_score = fuzz.ratio(deezer_song_name, spotify_song_name)

        # Comparaison des artistes de chansons
        artist_match_score = fuzz.ratio(deezer_song_artist, spotify_song_artist)

        # Comparaison des durées de chansons (avec une certaine tolérance)
        duration_match_score = fuzz.token_sort_ratio(str(deezer_song_duration), str(spotify_song_duration))

        # Calcul d'un score global
        match_score = (name_match_score + artist_match_score + duration_match_score) / 3

        if match_score > best_match_score:
            best_match_score = match_score
            best_match = spotify_song

    return best_match


def find_matching_song_from_spotify_to_deezer(spotify_song_name, spotify_song_artist, spotify_song_duration, deezer_song_list):
    best_match = None
    best_match_score = 0

    for deezer_song in deezer_song_list:
        deezer_song_name = deezer_song['name']
        deezer_song_artist = deezer_song['artist']
        deezer_song_duration = deezer_song['duration']

        # Comparaison des noms de chansons
        name_match_score = fuzz.ratio(spotify_song_name, deezer_song_name)

        # Comparaison des artistes de chansons
        artist_match_score = fuzz.ratio(spotify_song_artist, deezer_song_artist)

        # Comparaison des durées de chansons (avec une certaine tolérance)
        duration_match_score = fuzz.token_sort_ratio(str(spotify_song_duration), str(deezer_song_duration))

        # Calcul d'un score global
        match_score = (name_match_score + artist_match_score + duration_match_score) / 3

        if match_score > best_match_score:
            best_match_score = match_score
            best_match = deezer_song

    return best_match
