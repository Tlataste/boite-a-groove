from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from .forms import RegisterUserForm


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
        return render(request, 'authentication/login.html', {})  # {} is the context dictionary


def logout_user(request):
    logout(request)
    messages.success(request, ("You logged out with success."))
    return redirect('/box/barlz')


def register_user(request):
    if request.method == "POST":  # if user filled the form
        form = RegisterUserForm(request.POST)  # Imported form
        if form.is_valid():
            form.save()
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']  # Because 2 pwd fields when you register

            # When someone creates an account, it logs them in at the same time
            user = authenticate(username=username, password=password)
            login(request, user)
            messages.success(request, ("Inscription réussie!"))
            return redirect('/box/barlz')
    else:  # if GET request, show form
        form = RegisterUserForm()
    return render(request, 'authentication/register.html', {
        'form': form,
    })  # {} is the context dictionary


def example(request):
    return render(request, 'connect.html', {})
