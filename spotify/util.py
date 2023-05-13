from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post
from .credentials import CLIENT_ID, CLIENT_SECRET

# Check if the user already exists
def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user='session_id')
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

# Adds or updates tokens in the database
def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    expires_in =  timezone.now() + timedelta(seconds=expires_in) # Expires in one hour from now

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        tokens = SpotifyToken(user=session_id, access_token= access_token, refresh_token = refresh_token, token_type = token_type, expires_in = expires_in)
        tokens.save()


# Refresh token function

def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now(): # If the token has expired
            refresh_spotify_token(session_id)

        return True
    
    return False

# the access token is used to access the user's resources for a limited period of time,
# while the refresh token is used to obtain a new access token once the current token has expired.
def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type') # Not truly necessary because it will never change it's allways Bearer
    expires_in = response.get('expires_in')
    refresh_token = response.get('refresh_token')

    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)