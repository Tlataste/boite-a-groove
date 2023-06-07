from django.urls import path
from . import views

urlpatterns = [
    path('login_user', views.LoginUser.as_view(), name="login"),
    path('logout_user', views.LogoutUser.as_view(), name="logout"),
    path('register_user', views.register_user, name="register"),
    path('example', views.example, name="example"),
]
