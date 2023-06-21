from fuzzywuzzy import fuzz
from spotify.spotipy_client import sp
from deezer.util import execute_deezer_api_request


def find_matching_song(song_name, song_artist, song_duration, song_list):
    """
    Finds the best matching song from a list of songs based on the song name, artist and duration.

    Args:
        song_name: The name of the song to match.
        song_artist: The artist of the song to match.
        song_duration: The duration of the song to match.
        song_list: The list of songs to search in.

    Returns:
        The best matching song from the list of songs.
    """
    best_match = None
    best_match_score = 0

    for song in song_list:
        best_song_name = song['name']
        best_song_artist = song['artist']
        best_song_duration = song['duration']

        # Compare the song names
        name_match_score = fuzz.ratio(song_name, best_song_name)

        # Compare the song artists
        artist_match_score = fuzz.ratio(song_artist, best_song_artist)

        # Compare the song durations with a certain tolerance
        duration_match_score = fuzz.token_sort_ratio(str(song_duration), str(best_song_duration))

        # Calculate the average match score
        match_score = (name_match_score + artist_match_score + duration_match_score) / 3

        # If the current match score is better than the best match score, update the best match
        if match_score > best_match_score:
            best_match_score = match_score
            best_match = song

    return best_match


def search_on_spotify(search_query, song):
    """
    Searches for tracks using the Spotify API.

    Args:
        search_query: The search query to search for.
        song: The song to match.

    Returns:
        The list of tracks matching the search query.
    """
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
    """
    Searches for tracks using the Deezer API.

    Args:
        search_query: The search query to search for.
        song: The song to match.
        session_key: The session key to use for the API request.

    Returns:
        The list of tracks matching the search query.
    """
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
