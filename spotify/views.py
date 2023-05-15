from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .util import *
import base64
from urllib.parse import urlencode
import requests
import webbrowser


# To authenticate the application (first step in the diagram):
# We generate a URL that the frontend can GET in order to send it to Spotify
class AuthURL(APIView):
    def get(self, request, format=None):
        # Defines what information we wanna access
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
        response = execute_spotify_api_request(
            self.request.session.session_key,
            'player/recently-played')

        print(self.request.session.session_key)

        return Response(response, status=status.HTTP_200_OK)
