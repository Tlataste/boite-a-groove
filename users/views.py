from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .forms import RegisterUserForm
from django import forms


class LoginUser(APIView):
    '''
    Class goal:
    This class represents an API view for logging an user in.

    Methods:
    def post(self, request, format=None):
        Checks credentials and if match found, connect the user.

    Doc used : https://docs.djangoproject.com/en/4.2/topics/auth/default/
    '''

    def post(self, request, format=None):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Return the authentication status in the response
            is_authenticated = True
            return Response({'status': is_authenticated},
                            status=status.HTTP_200_OK)
        else:
            is_authenticated = False
            return Response({'status': is_authenticated},
                            status=status.HTTP_401_UNAUTHORIZED)


class LogoutUser(APIView):
    '''
    Class goal:
    This class represents an API view for logging an user out.

    Methods:
    def get(self, request, format=None):
        Checks if user is logged in, if so logs him out.

    Doc used : https://docs.djangoproject.com/en/4.2/topics/auth/default/
    '''

    def get(self, request, format=None):
        if request.user.is_authenticated:
            logout(request)
            is_logged_out = True
            return Response({'status': is_logged_out},
                            status=status.HTTP_200_OK)
        else:
            is_logged_out = False
            return Response({'status': is_logged_out},
                            status=status.HTTP_401_UNAUTHORIZED)


class RegisterUser(APIView):
    '''
    Class goal:
    This class represents an API view for registering an user.

    Methods:
    def post(self, request, format=None):
        Registers an user.

    Doc used : https://docs.djangoproject.com/en/4.2/topics/auth/default/
    '''

    def post(self, request, format=None):

        form = RegisterUserForm(data=request.data)
        if form.is_valid():
            form.save()
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']  # Because 2 pwd fields when you register

            # When someone creates an account, it logs them in at the same time
            user = authenticate(username=username, password=password)
            login(request, user)
            messages.success(request, ("Inscription réussie!"))
            return Response({'status': True},
                            status=status.HTTP_200_OK)
        else:
            errors = form.errors
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)


def example(request):
    return render(request, 'connect.html', {})
