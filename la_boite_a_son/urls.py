"""la_boite_a_son URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

# Here, dispatch the URLs to the correct app

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('frontend.urls')),
    path('spotify/', include('spotify.urls')),  # Any address with /spotify/...
    path('box-management/', include('box_management.urls')),
    path('deezer/', include('deezer.urls')),
    path('users/', include('django.contrib.auth.urls')),  # Bundled Django auth URLs
    path('users/', include('users.urls')),
    path('api_agg/', include('api_aggregation.urls')),
    path('oauth/', include('social_django.urls', namespace='social')),  # Social-Auth endpoints
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
