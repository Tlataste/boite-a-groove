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

        # Extract the id of the streaming platform from the request data
        request_platform = request.data.get('platform')

        if request_platform == "spotify":
            platform_req_id = 1
        else:
            platform_req_id = 2

        try:  # The song already exists in the database
            final_song = Song.objects.filter(title=song['title'], artist=song['artist'],
                                             platform_id=platform_req_id).get()
            return Response(final_song.url, status=status.HTTP_200_OK)

        except Song.DoesNotExist:  # The song does not exist in the database
            # Normalize the search query
            search_query = normalize_string(song['title'] + ' ' + song['artist'])

            elif platform_req_id == 2:  # The streaming platform is Deezer
                final_song = ut.search_on_deezer(search_query, song, self.request.session.session_key)
                return Response(final_song['url'], status=status.HTTP_200_OK)

            elif platform_req_id == 1:  # The streaming platform is Spotify
                final_song = ut.search_on_spotify(search_query, song)
                return Response(final_song['url'], status=status.HTTP_200_OK)

            else:
                # Return an error response
                return Response({'error': 'Invalid platform ID.'}, status=status.HTTP_400_BAD_REQUEST)
