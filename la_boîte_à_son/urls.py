"""la_boîte_à_son URL Configuration

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
from django.contrib import admin
from django.urls import path, include

# Here, dispatch the URLs to the correct app

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # Any address with /api/...
    path('', include('frontend.urls')),
    path('spotify/', include('spotify.urls')),  # Any address with /spotify/...
    path('box-management/', include('box_management.urls')),
    path('deezer/', include('deezer.urls')),
    path('users/', include('django.contrib.auth.urls')),  # Bundled Django auth URLs
    path('users/', include('users.urls'))
]
