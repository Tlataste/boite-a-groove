from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from spotify.spotipy_client import sp
from .util import *
import base64
from urllib.parse import urlencode
import requests


# To authenticate the application (first step in the diagram):
# We generate a URL that the frontend can GET in order to send it to Spotify
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
        scopes = 'user-read-recently-played'

        auth_headers = {
            "client_id": CLIENT_ID,
            "response_type": "code",
            "redirect_uri": REDIRECT_URI,
            "scope": scopes
        }
        return Response({'url': "https://accounts.spotify.com/authorize?" + urlencode(auth_headers)}, status=status.HTTP_200_OK)


# After the user has logged in (see diagram)
# We have to create a callback so that we can get the code returned by Spotify
# after our first request
# We get that response and then send a new request to get the tokens

def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    # This post method automatically sends the request and get the response
    # and we convert that into JSON
    # It's different from the above because in the first one, we only just
    # want to generate the URL

    encoded_credentials = base64.b64encode(CLIENT_ID.encode() + b':' + CLIENT_SECRET.encode()).decode("utf-8")

    headers = {
        "Authorization": "Basic " + encoded_credentials,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.post('https://accounts.spotify.com/api/token', headers=headers, data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    # All this for a single user in the database
    # For now we will use session keys, but later we will have to use user
    # accounts
    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key,
        access_token,
        token_type,
        expires_in,
        refresh_token)

    # Redirect back to the home page
    # If we want to redirect to the register page for example we write
    # frontend:register
    return redirect('frontend:')


# Checks if the user is authenticated
class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({'status': is_authenticated},
                        status=status.HTTP_200_OK)


class GetRecentlyPlayedTracks(APIView):
    def get(self, request, format=None):
        '''Request via util.py'''
        response = execute_spotify_api_request(
            self.request.session.session_key,
            'player/recently-played')

        if 'error' in response or 'items' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        tracks = []
        for item in response.get('items'):
            track = {
                'id': item['track']['id'],
                'name': item['track']['name'],
                'artist': item['track']['artists'][0]['name'],
                'album': item['track']['album']['name']
            }
            tracks.append(track)

        return Response(tracks, status=status.HTTP_200_OK)


class Search(APIView):
    def post(self, request, format=None):
        '''Request via Spotipy'''
        search_query = request.data.get('search_query')

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
                # 'image_url': item['album']['images'][0]['url'],
                # 'preview_url': item['preview_url'],
                # 'spotify_url': item['external_urls']['spotify'],
            }
            tracks.append(track)

        # Return the list of tracks as a response
        return Response(tracks, status=status.HTTP_200_OK)
