from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages


def login_user(request):
    '''
    Doc used : https://docs.djangoproject.com/en/4.2/topics/auth/default/
    '''
    if request.method == "POST":  # if user posted sth
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('/box/barlz')
        else:
            messages.success(request, ("Error logging in, try again."))
            return redirect('login')

    else:
        return render(request, 'authentication/login.html', {})


def logout_user(request):
    logout(request)
    messages.success(request, ("You logged out with success."))
    return redirect('/box/barlz')


def example(request):
    return render(request, 'connect.html', {})
