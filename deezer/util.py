from .models import DeezerToken
from django.utils import timezone
from datetime import timedelta
from requests import post, put, get
from .credentials import APP_ID, APP_SECRET
import json
import requests

BASE_URL = "https://api.deezer.com/"


# Check if the user already exists


def get_user_tokens(user):
    """
    Retrieves the Deezer tokens associated with a user session.

    Args:
        user: The username of the user.

    Returns:
        The DeezerToken object associated with the user session, or None if no tokens are found.
    """

    # Query the DeezerToken objects for tokens associated with the user session
    user_tokens = DeezerToken.objects.filter(user=user)

    # Check if any tokens exist for the user session
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def update_or_create_user_tokens(user, access_token):
    """
    Updates or creates Deezer tokens for a user session.

    Args:
        user: The username of the user.
        access_token: The access token received from Deezer.

    Returns:
        None
    """

    # Retrieve existing tokens associated with the user session
    tokens = get_user_tokens(user)

    if tokens:
        # Update the existing tokens with the new values
        tokens.access_token = access_token
        tokens.save(update_fields=['access_token'])
    else:
        # Create a new token object for the user session
        tokens = DeezerToken(user=user, access_token=access_token)
        tokens.save()


def is_deezer_authenticated(user):
    """
    Checks if the user is authenticated with Deezer.
    """
    tokens = get_user_tokens(user)
    if tokens:
        return True
    else:
        return False


def execute_deezer_api_request(user, endpoint, post_=False, put_=False, recent=False):
    """
        Executes a request to the Deezer API with the provided session ID, endpoint, and request type.

        Args:
            user: The username of the user.
            endpoint: The API endpoint to request.
            post_: Optional flag to indicate if the request should be a POST request (default: False).
            put_: Optional flag to indicate if the request should be a PUT request (default: False).
            recent: Optional flag to indicate if the request should be a recent track request (default: False).

        Returns:
            The JSON response from the Deezer API.
    """
    # Retrieve the Deezer tokens associated with the user session
    if recent:
        tokens = get_user_tokens(user).access_token
    else:
        tokens = ""

    # Prepare the headers for the API request
    headers = {
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
        if recent:
            response = requests.get(BASE_URL + endpoint + "&access_token=" + tokens, headers=headers, params=user_params)
        else:
            response = requests.get(BASE_URL + endpoint, headers=headers, params=user_params)
    return response
