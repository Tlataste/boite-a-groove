from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from spotify.spotipy_client import sp
from fuzzywuzzy import fuzz


class ApiAggregation:

    def post(self, request):
        # Extract the id of the streaming platform from the request data
        platform_id = request.data.get('platform_id')

        # Extract the search query from the request data
        search_query = request.data.get('search_query')

        if platform_id == 1:  # The streaming platform is Spotify
            # Search for tracks using the Spotipy client
            results = sp.search(q=search_query, type='track')

            # Extract the track data from the results and create a list of tracks
            tracks = []
            for item in results['tracks']['items']:
                track = {
                    'id': item['id'],
                    'name': item['name'],
                    'artist': item['artists'][0]['name'],
                    'album': item['album']['name'],
                    'image_url': item['album']['images'][0]['url'],
                    ''
                    'spotify_url': item['external_urls']['spotify'],
                }
                tracks.append(track)
            return Response(tracks, status=status.HTTP_200_OK)

        elif platform_id == 2:  # The streaming platform is Deezer
            # Search for tracks using the Spotipy client
            results = sp.search(q=search_query, type='track')

            # Extract the track data from the results and create a list of tracks
            tracks = []
            for item in results['tracks']['items']:
                track = {
                    'id': item['id'],
                    'name': item['name'],
                    'artist': item['artists'][0]['name'],
                    'album': item['album']['name'],
                    'image_url': item['album']['images'][0]['url'],
                    # 'preview_url': item['preview_url'],
                    'spotify_url': item['external_urls']['spotify'],
                }
                tracks.append(track)
            return Response(tracks, status=status.HTTP_200_OK)
        else:
            # Return an error response
            return Response({'error': 'Invalid platform ID.'}, status=status.HTTP_400_BAD_REQUEST)

    def find_matching_song(self, deezer_song_name, deezer_song_duration, spotify_song_list):
        best_match = None
        best_match_score = 0

        for spotify_song in spotify_song_list:
            spotify_song_name = spotify_song['name']
            spotify_song_duration = spotify_song['duration_ms'] / 1000  # Convertir la durée en secondes

            # Comparaison des noms de chansons
            name_match_score = fuzz.ratio(deezer_song_name, spotify_song_name)

            # Comparaison des durées de chansons (avec une certaine tolérance)
            duration_match_score = fuzz.token_sort_ratio(str(deezer_song_duration), str(spotify_song_duration))

            # Calcul d'un score global
            match_score = (name_match_score + duration_match_score) / 2

            if match_score > best_match_score:
                best_match_score = match_score
                best_match = spotify_song

        return best_match

    deezer_song_name = "Nom de la chanson sur Deezer"
    deezer_song_duration = 180  # Durée en secondes
    spotify_song_list = [
        {"name": "Nom de la chanson sur Spotify 1", "duration_ms": 180000},
        {"name": "Nom de la chanson sur Spotify 2", "duration_ms": 200000},
        ...
    ]

    matching_song = find_matching_song(deezer_song_name, deezer_song_duration, spotify_song_list)
    print(matching_song)

