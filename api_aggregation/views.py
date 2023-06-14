from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

import api_aggregation.util as ut
from box_management.models import Song
from box_management.util import normalize_string
from deezer.util import execute_deezer_api_request
from spotify.spotipy_client import sp


class ApiAggregation(APIView):
    def post(self, request):
        # Extract the search query from the request data
        song = request.data.get('song')
        # song = {
        #     'name': 'Lose Yourself',
        #     'artist': 'Eminem',
        #     'duration': 326,
        #     'platform_id': 1,
        # }

        # Extract the id of the streaming platform from the request data
        platform_id = song['platform_id']
        request_platform = request.data.get('platform')

        if request_platform == "spotify":
            platform_req_id = 1
        else:
            platform_req_id = 2

        try:  # The song already exists in the database
            final_song = Song.objects.filter(title=song['title'], artist=song['artist'], platform_id=platform_req_id).get()
            return Response(final_song.url, status=status.HTTP_200_OK)

        except Song.DoesNotExist:  # The song does not exist in the database
            # Normalize the search query
            search_query = normalize_string(song['title'] + ' ' + song['artist'])
            tracks = []

            if platform_id == 1 and platform_req_id == 2:  # The streaming platform is Spotify
                # Search for tracks using the Deezer API
                results = execute_deezer_api_request(
                    self.request.session.session_key,
                    'search/track?q=' + search_query + '&output=json')
                results = results.json()
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
                final_song = ut.find_matching_song_from_spotify_to_deezer(song['title'], song['artist'],
                                                                          song['duration'],
                                                                          tracks)
                return Response(final_song['url'], status=status.HTTP_200_OK)

            elif platform_id == 2 and platform_req_id == 1:  # The streaming platform is Deezer
                # Search for tracks using the Spotipy client
                results = sp.search(q=search_query, type='track')

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
                    final_song = ut.find_matching_song_from_deezer_to_spotify(song['title'], song['artist'],
                                                                              song['duration'], tracks)

                return Response(final_song['url'], status=status.HTTP_200_OK)
            else:
                # Return an error response
                return Response({'error': 'Invalid platform ID.'}, status=status.HTTP_400_BAD_REQUEST)
