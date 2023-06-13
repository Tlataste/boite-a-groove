from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post, put, get
from .credentials import CLIENT_ID, CLIENT_SECRET
import requests

BASE_URL = "https://api.spotify.com/v1/me/"


# Check if the user already exists


def get_user_tokens(user):
    """
    Retrieves the Spotify tokens associated with a user session.

    Args:
        user: The username of the user.

    Returns:
        The SpotifyToken object associated with the user session, or None if no tokens are found.
    """

    # Query the SpotifyToken objects for tokens associated with the user session
    try:
        user_tokens = SpotifyToken.objects.filter(user=user)
        # Check if any tokens exist for the user session
        if user_tokens.exists():
            return user_tokens[0]
        else:
            return None
    except TypeError:
        return None


def update_or_create_user_tokens(user, access_token, token_type, expires_in, refresh_token):
    """
    Updates or creates Spotify tokens for a user session.

    Args:
        user: The username of the user.
        access_token: The access token received from Spotify.
        token_type: The type of access token (e.g., "Bearer").
        expires_in: The expiration time of the access token in seconds.
        refresh_token: The refresh token received from Spotify.

    Returns:
        None
    """

    # Retrieve existing tokens associated with the user session
    tokens = get_user_tokens(user)

    # Calculate the expiration time for the access token
    expires_in = timezone.now() + timedelta(seconds=expires_in)  # Expires in one hour from now

    if tokens:
        # Update the existing tokens with the new values
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        # Create a new SpotifyToken object for the user session
        tokens = SpotifyToken(user=user, access_token=access_token, refresh_token=refresh_token, token_type=token_type,
                              expires_in=expires_in)
        tokens.save()


def is_spotify_authenticated(user):
    """
    Checks if a user session is authenticated with Spotify.

    Args:
        user: The username of the user.
    Returns:
        True if the user session is authenticated with Spotify, False otherwise.
    """

    # Retrieve the Spotify tokens associated with the user session
    tokens = get_user_tokens(user)

    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():  # If the token has expired
            refresh_spotify_token(user)

        return True
    else:
        return False


# Notes :
# The access token is used to access the user's resources for a limited period of time,
# while the refresh token is used to obtain a new access token once the current token has expired.


def disconnect_user(user):
    """
    Disconnects the user from Spotify.
    """
    tokens = get_user_tokens(user)
    if tokens:
        tokens.delete()


def refresh_spotify_token(user):
    """
    Refreshes the Spotify access token for a user session using the refresh token.

    Args:
        user: The username of the user.
    Returns:
        None
    """

    # Retrieve the refresh token associated with the user session
    refresh_token = get_user_tokens(user).refresh_token

    # Send a POST request to the Spotify API to refresh the access token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    # Extract the new access token and its expiration time from the response
    access_token = response.get('access_token')
    token_type = response.get('token_type')  # Not truly necessary because it will never change it's allways Bearer
    expires_in = response.get('expires_in')

    # Update the user tokens with the new access token
    update_or_create_user_tokens(user, access_token, token_type, expires_in, refresh_token)


def execute_spotify_api_request(user, endpoint, post_=False, put_=False):
    """
    Executes a request to the Spotify API with the provided session ID, endpoint, and request type.

    Args:
        user: The username of the user.
        endpoint: The API endpoint to request.
        post_: Optional flag to indicate if the request should be a POST request (default: False).
        put_: Optional flag to indicate if the request should be a PUT request (default: False).

    Returns:
        The JSON response from the Spotify API.
    """

    # Retrieve the Spotify tokens associated with the user session
    tokens = get_user_tokens(user)

    # Prepare the headers for the API request
    headers = {
        "Authorization": "Bearer " + tokens.access_token,
        "Content-Type": "application/json"
    }

    # Prepare the user params for the API request
    user_params = {
        "limit": 50
    }

    if post_:
        # Send a POST request to the specified API endpoint
        post(BASE_URL + endpoint, headers=headers)
    elif put_:
        # Send a PUT request to the specified API endpoint
        put(BASE_URL + endpoint, headers=headers)
    else:
        # Send a GET request to the specified API endpoint with user params
        response = requests.get(BASE_URL + endpoint, params=user_params, headers=headers)

    return response.json()
