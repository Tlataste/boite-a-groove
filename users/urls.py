from django.urls import path
from . import views

urlpatterns = [
    path('login_user', views.LoginUser.as_view(), name="login"),
    path('logout_user', views.LogoutUser.as_view(), name="logout"),
    path('register_user', views.RegisterUser.as_view(), name="register"),
    path('check-authentication/', views.CheckAuthentication.as_view(), name='check-authentication'),
    path('change-password', views.ChangePasswordUser.as_view(), name="change-password"),
    path('get-profile-picture-url', views.GetProfilePictureConnectedURL.as_view(), name='get-profile-picture-url'),
    path('example', views.example, name="example"),
]
