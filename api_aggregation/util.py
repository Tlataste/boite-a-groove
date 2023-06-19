from fuzzywuzzy import fuzz
from spotify.spotipy_client import sp
from deezer.util import execute_deezer_api_request


def find_matching_song(song_name, song_artist, song_duration, song_list):
    best_match = None
    best_match_score = 0

    for song in song_list:
        best_song_name = song['name']
        best_song_artist = song['artist']
        best_song_duration = song['duration']

        # Comparaison des noms de chansons
        name_match_score = fuzz.ratio(song_name, best_song_name)

        # Comparaison des artistes de chansons
        artist_match_score = fuzz.ratio(song_artist, best_song_artist)

        # Comparaison des durées de chansons (avec une certaine tolérance)
        duration_match_score = fuzz.token_sort_ratio(str(song_duration), str(best_song_duration))

        # Calcul d'un score global
        match_score = (name_match_score + artist_match_score + duration_match_score) / 3

        if match_score > best_match_score:
            best_match_score = match_score
            best_match = song

    return best_match


def search_on_spotify(search_query, song):
    results = sp.search(q=search_query, type='track')
    tracks = []
    # Extract the track data from the results and create a list of tracks
    for item in results['tracks']['items']:
        track = {
            'id': item['id'],
            'name': item['name'],
            'artist': item['artists'][0]['name'],
            'album': item['album']['name'],
            'image_url': item['album']['images'][0]['url'],
            'duration': item['duration_ms'] // 1000,
            'platform_id': 1,
            'url': item['external_urls']['spotify'],
        }
        tracks.append(track)
    final_song = find_matching_song(song['title'], song['artist'], song['duration'], tracks)
    return final_song


def search_on_deezer(search_query, song, session_key):
    # Search for tracks using the Deezer API
    results = execute_deezer_api_request(
        session_key,
        'search/track?q=' + search_query + '&output=json')
    results = results.json()
    tracks = []
    # Extract the track data from the results and create a list of tracks
    for item in results['data']:
        track = {
            'id': item['id'],
            'name': item['title'],
            'artist': item['artist']['name'],
            'album': item['album']['title'],
            'image_url': item['album']['cover_medium'],
            'duration': item['duration'],
            'platform_id': 2,
            'url': item['link'],
        }
        tracks.append(track)
    final_song = find_matching_song(song['title'], song['artist'], song['duration'], tracks)
    return final_song


