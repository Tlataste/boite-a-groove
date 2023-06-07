from django.urls import path
from .views import AuthURL, deezer_callback, IsAuthenticated, Search

urlpatterns = [
    path('auth-redirection', AuthURL.as_view()),
    path('redirect', deezer_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    # path('recent-tracks', GetRecentlyPlayedTracks.as_view()),
    path('search', Search.as_view())
]
