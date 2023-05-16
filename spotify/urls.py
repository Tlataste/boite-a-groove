from django.urls import path
from .views import AuthURL, spotify_callback, IsAuthenticated, GetRecentlyPlayedTracks


urlpatterns = [
    path('auth-redirection', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('recent-tracks', GetRecentlyPlayedTracks.as_view())
]
