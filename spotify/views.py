from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *


# To authenticate the application (first step in the diagram):
# We generate a URL that the frontend can GET in order to send it to Spotify
class AuthURL(APIView):
    def get(self, request, format=None):
        # Defines what information we wanna access
        scopes = 'user-read-recently-played'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            "response_type": 'code', # that returned code will allow us to authenticate the user
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)
    

# After the user has logged in (see diagram)
# We have to create a callback so that we can get the code returned by Spotify after our first request
# We get that response and then send a new request to get the tokens

# After 
def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    # This post method automatically sends the request and get the response and we convert that into JSON
    # It's different from the above because in the first one, we only just want to generate the URL
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    # All this for a single user in the database
    # For now we will use session keys, but later we will have to use user accounts
    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)

    # Redirect back to the home page
    # If we want to redirect to the register page for example we write frontend:register
    return redirect('frontend:')


# Checks if the user is authenticated
class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)
    
class GetRecentlyPlayedTracks(APIView):
    def get(self, request, format=None):
        response = execute_spotify_api_request(request.session.session_key, 'player/recently-played')
        print(response)
        return Response(response, status=status.HTTP_200_OK)
