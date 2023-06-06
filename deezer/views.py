import json

from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, APP_ID, APP_SECRET
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
import base64
from urllib.parse import urlencode
import requests


# Create your views here.
class AuthURL(APIView):
    """
    Class goal:
    This class represents an API view for generating an authentication URL for Spotify.

    Methods:
    def get(self, request, format=None):
        Retrieves the authentication URL.

    """

    def get(self, request, format=None):
        """
        Method goal:
        Retrieves the authentication URL for Spotify.

        Arguments:
        self    : The instance of the class.
        request : The request object.
        format  : The desired format of the response. Defaults to None.

        Returns:
        dict: A dictionary containing the authentication URL.

        """
        return Response({
            'url': "https://connect.deezer.com/oauth/auth.php?app_id=" + APP_ID + "&redirect_uri=" + REDIRECT_URI + "&perms=email,basic_access"},
            status=status.HTTP_200_OK)


def deezer_callback(request, format=None):
    """
    Callback function for handling the Deezer authorization code flow.
    This function exchanges the authorization code received from Spotify for access and refresh tokens,
    and stores the user tokens in the database.

    Args:
        request: The HTTP request object containing the callback parameters.
        format: Optional format parameter for specifying the response format.

    Returns:
        A redirect response to the home page.
    """

    # Extract the authorization code and error from the callback parameters
    code = request.GET.get('code')
    error = request.GET.get('error_reason')

    response = requests.get(url=f'https://connect.deezer.com/oauth/access_token.php?app_id={APP_ID}'
                                f'&secret={APP_SECRET}&code={code}&output=json').content
    response = response.decode()

    response = json.loads(response)
    # Extract the fields from the response
    access_token = response['access_token']
    expires_in = response['expires']

    # Create a session if it doesn't exist
    if not request.session.exists(request.session.session_key):
        request.session.create()

    # Update or create the user tokens in the database
    # Redirect back to the home page
    # If we want to redirect to the register page for example we should write frontend:register
    return redirect('frontend:')

# class IsAuthenticated(APIView):
#     """
#     API view class for checking if the user is authenticated with Spotify.
#
#     Methods:
#         get(request, format=None): Retrieves the authentication status of the user.
#     """
#
#     def get(self, request, format=None):
#         """
#         Retrieves the authentication status (true if authentifcated, false if not) of the user.
#
#         Args:
#             request: The HTTP request object.
#             format: Optional format parameter for specifying the response format.
#
#         Returns:
#             A Response object containing the authentication status of the user.
#
#         Raises:
#             None
#         """
#
#         # Check if the user is authenticated with Spotify
#         is_authenticated = is_spotify_authenticated(
#             self.request.session.session_key)
#
#         # Return the authentication status in the response
#         return Response({'status': is_authenticated},
#                         status=status.HTTP_200_OK)
#
#
# class GetRecentlyPlayedTracks(APIView):
#     """
#     API view class for retrieving the recently played tracks of the user from Spotify.
#
#     Methods:
#         get(request, format=None): Retrieves the recently played tracks of the user.
#
#     Attributes:
#         None
#     """
#
#     def get(self, request, format=None):
#         """
#         Retrieves the recently played tracks of the user from Spotify.
#
#         Args:
#             request: The HTTP request object.
#             format: Optional format parameter for specifying the response format.
#
#         Returns:
#             A Response object containing the recently played tracks of the user.
#         """
#
#         # Execute the Spotify API request to retrieve the recently played tracks
#         response = execute_spotify_api_request(
#             self.request.session.session_key,
#             'player/recently-played')
#
#         # Check if there is an error in the response or if the 'items' key is missing
#         if 'error' in response or 'items' not in response:
#             return Response({}, status=status.HTTP_204_NO_CONTENT)
#
#         # Parse and filter the response to extract relevant track information
#         tracks = []
#         for item in response.get('items'):
#
#             # Check if the list doesn't already contain the song
#             if not any(existing_track['id'] == item['track']['id'] for existing_track in tracks):
#                 track = {
#                     'id': item['track']['id'],
#                     'name': item['track']['name'],
#                     'artist': item['track']['artists'][0]['name'],
#                     'album': item['track']['album']['name'],
#                     'image_url': item['track']['album']['images'][0]['url']
#                 }
#                 tracks.append(track)
#
#         # Return the list of recently played tracks in the response
#         return Response(tracks, status=status.HTTP_200_OK)
#
#
# class Search(APIView):
#     """
#     API view class for searching tracks using the Spotify API.
#
#     Methods:
#         post(request, format=None): Searches for tracks based on the provided search query.
#     """
#
#     def post(self, request, format=None):
#         """
#         Searches for tracks based on the provided search query.
#
#         Args:
#             request: The HTTP request object.
#             format: Optional format parameter for specifying the response format.
#
#         Returns:
#             A Response object containing the search results as a list of tracks.
#         """
#
#         # Extract the search query from the request data
#         search_query = request.data.get('search_query')
#
#         # Search for tracks using the Spotipy client
#         results = sp.search(q=search_query, type='track')
#
#         # Extract the track data from the results and create a list of tracks
#         tracks = []
#         for item in results['tracks']['items']:
#             track = {
#                 'id': item['id'],
#                 'name': item['name'],
#                 'artist': item['artists'][0]['name'],
#                 'album': item['album']['name'],
#                 'image_url': item['album']['images'][0]['url'],
#                 # 'preview_url': item['preview_url'],
#                 'spotify_url': item['external_urls']['spotify'],
#             }
#             tracks.append(track)
#
#         # Return the list of tracks as a response
#         return Response(tracks, status=status.HTTP_200_OK)
