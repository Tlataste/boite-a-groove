from django.contrib.auth.models import AnonymousUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView  # Generic API view
from .serializers import *
from .models import *
from .util import calculate_distance


class GetBox(APIView):
    lookup_url_kwarg = 'name'
    serializer_class = BoxSerializer

    def get(self, request, format=None):
        name = request.GET.get(self.lookup_url_kwarg)
        if name is not None:
            box = Box.objects.filter(name=name)
            if len(box) > 0:
                data = BoxSerializer(box[0]).data  # Gets in json the data from the database corresponding to the Box
                deposit_count = Deposit.objects.filter(box_id=data.get('id')).count()
                # Get the deposits of the box corresponding to the ones in table VisibleDeposits
                last_deposit = Deposit.objects.filter(box_id=data.get('id'),
                                                      id__in=VisibleDeposit.objects
                                                      .values('deposit_id')).order_by('-deposited_at')
                # Get the names of the songs corresponding to the deposits
                songs = Song.objects.filter(id__in=last_deposit.values('song_id')).order_by('-id')
                songs = SongSerializer(songs, many=True).data
                last_deposit = DepositSerializer(last_deposit, many=True).data

                resp = {}
                resp['last_deposits'] = last_deposit
                resp['last_deposits_songs'] = songs
                resp['deposit_count'] = deposit_count
                resp['box'] = data
                return Response(resp, status=status.HTTP_200_OK)
            else:
                return Response({'Bad Request': 'Invalid Box Name'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'Bad Request': 'Name of the box not found in request'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        # Get the data from the request (song name, artist, platform_id, box name)
        option = request.data.get('option')
        song_id = option.get('id')

        song_name = option.get('name')
        song_author = option.get('artist')
        song_platform_id = option.get('platform_id')
        box_name = request.data.get('boxName')

        # # Normalise the song and artist names
        # song_name = normalize_string(song_name)
        # song_author = normalize_string(song_author)

        # Verify if the song already exists
        try:
            song = Song.objects.filter(song_id=song_id, title=song_name, artist=song_author,
                                       platform_id=song_platform_id).get()
            song.n_deposits += 1
            song.save()

        except Song.DoesNotExist:
            # Create a new song
            song_url = option.get('url')
            song_image = option.get('image_url')
            song_duration = option.get('duration')
            song = Song(song_id=song_id, title=song_name, artist=song_author, url=song_url, image_url=song_image,
                        duration=song_duration,
                        platform_id=song_platform_id, n_deposits=1)
            song.save()

        # Create a new deposit
        box = Box.objects.filter(name=box_name).get()
        user = request.user if not isinstance(request.user, AnonymousUser) else None
        new_deposit = Deposit(song_id=song, box_id=box, user=user)
        new_deposit.save()
        new_deposit = DepositSerializer(new_deposit).data
        # Rediriger vers la page de détails de la boîte
        return Response(new_deposit, status=status.HTTP_200_OK)


class ReplaceVisibleDeposits(APIView):
    def post(self, request, format=None):
        # Get the box, the visible deposit disclosed by the user and the search deposit
        box_id = request.data.get('visible_deposit').get('box_id')
        visible_deposit_id = request.data.get('visible_deposit').get('id')
        search_deposit_id = request.data.get('search_deposit').get('id')

        # Delete the visible deposit disclosed by the user
        VisibleDeposit.objects.filter(deposit_id_id=visible_deposit_id).delete()

        # Get the most recent deposit that is not in the visible deposits
        i = 0
        while search_deposit_id in VisibleDeposit.objects.filter(deposit_id__box_id=box_id).values('deposit_id'):
            i += 1
            search_deposit_id = Deposit.objects.filter(box_id=box_id).order_by('-deposited_at')[i].id

        # Create a new visible deposit with the search deposit
        search_deposit = Deposit.objects.filter(id=search_deposit_id).get()
        VisibleDeposit(deposit_id=search_deposit).save()
        return Response({'success': True}, status=status.HTTP_200_OK)


class Location(APIView):
    def post(self, request, format=None):
        latitude = float(request.data.get('latitude'))
        longitude = float(request.data.get('longitude'))
        box = request.data.get('box')
        box = Box.objects.filter(id=box.get('id')).get()
        # Get all location points of the box
        points = LocationPoint.objects.filter(box_id=box)
        is_valid_location = False
        if len(points) == 0:
            # No location points for this box, return an error in the response
            return Response({'error': 'No location points for this box'}, status=status.HTTP_404_NOT_FOUND)
        for point in points:
            # Get the coordinates of the point
            max_dist = point.dist_location
            target_latitude = point.latitude
            target_longitude = point.longitude
            # Calculate distance between the two points
            distance = calculate_distance(latitude, longitude, target_latitude, target_longitude)
            # Compare the coordinates with the desired location
            if distance <= max_dist:
                is_valid_location = True

        if is_valid_location:
            # Location is valid
            return Response({'valid': True}, status=status.HTTP_200_OK)
        else:
            # Location is not valid
            return Response({'valid': False, 'lat': latitude, 'long': longitude}, status=status.HTTP_403_FORBIDDEN)


class CurrentBoxManagement(APIView):

    def get(self, request, format=None):
        try:
            current_box_name = request.session['current_box_name']
            return Response({'current_box_name': current_box_name}, status=status.HTTP_200_OK)
        except KeyError:
            # The 'current_box_name' key does not exist in request.session
            return Response({'error': 'La clé current_box_name n\'existe pas'}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):

        # Guard clause that checks if user is logged in
        if 'current_box_name' not in request.data:
            return Response({'errors': 'Aucun nom de boîte n\'a été fournie.'}, status=status.HTTP_401_UNAUTHORIZED)

        current_box_name = request.data.get('current_box_name')

        try:
            # Update the current box name in the user's session
            request.session['current_box_name'] = current_box_name
            request.session.modified = True

            return Response({'status': 'Le nom de la boîte actuelle a été modifié avec succès.'},
                            status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'errors': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UpdateVisibleDeposits(APIView):
    def post(self, request, format=None):
        box_name = request.data.get('boxName')
        box = Box.objects.filter(name=box_name).get()

        # Get the maximum number of deposits to display
        max_deposits = box.max_deposits
        # Get the visible deposits of the box
        visible_deposits = VisibleDeposit.objects.filter(deposit_id__box_id=box).order_by('-deposit_id__deposited_at')
        # Get the number of visible deposits
        n_visible_deposits = len(visible_deposits)

        # If the number of visible deposits is more than the maximum number of deposits to display
        if n_visible_deposits > max_deposits:
            # Delete the oldest visible deposits
            for i in range(max_deposits, n_visible_deposits):
                visible_deposits[i].delete()
        # If the number of visible deposits is less than the maximum number of deposits to display
        elif n_visible_deposits < max_deposits:
            # Get the number of deposits to add
            n_deposits_to_add = max_deposits - n_visible_deposits
            # Get the last n_deposits_to_add deposits of the box that are not visible
            deposits_to_add = Deposit.objects.filter(box_id=box).exclude(
                id__in=visible_deposits.values('deposit_id')).order_by('-deposited_at')[:n_deposits_to_add]
            # Add the deposits to the visible deposits
            for deposit in deposits_to_add:
                VisibleDeposit(deposit_id=deposit).save()
        return Response({'success': True}, status=status.HTTP_200_OK)


class ManageDiscoveredSongs(APIView):
    """Class used to update and get the discovered songs of the user"""

    def post(self, request):
        user = request.user

        # Check if the user is authenticated
        if not user.is_authenticated:
            return Response({'error': 'Vous devez être connecté pour effectuer cette action.'},
                            status=status.HTTP_401_UNAUTHORIZED)
        else:
            # Add the deposit to the user's discovered songs
            deposit_id = request.data.get('visible_deposit').get('id')
            deposit = Deposit.objects.filter(id=deposit_id).get()
            # Get the song_id linked to the deposit of the user
            song_id = deposit.song_id
            # Check if the song is linked to another deposit
            if DiscoveredSong.objects.filter(user_id=user, deposit_id__song_id__artist=song_id.artist,
                                             deposit_id__song_id__title=song_id.title).exists():
                # The song is already linked to another deposit
                return Response({'error': 'Cette chanson est déjà liée à un autre dépôt.'},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                # Create a new discovered song linked to the user
                DiscoveredSong(user_id=user, deposit_id=deposit).save()
                return Response({'success': True}, status=status.HTTP_200_OK)

    def get(self, request):
        # Get the user
        user = request.user
        # Check if the user is authenticated
        if not user.is_authenticated:
            return Response({'error': 'Vous devez être connecté pour effectuer cette action.'},
                            status=status.HTTP_401_UNAUTHORIZED)
        else:
            # Get the discovered songs of the user
            discovered_deposits = DiscoveredSong.objects.filter(user_id=user).order_by('-deposit_id__deposited_at')
            discovered_songs = []
            # Get the songs from the discovered deposits
            for deposit in discovered_deposits:
                deposit_id = deposit.deposit_id
                song = Song.objects.filter(deposit=deposit_id).get()
                discovered_songs.append(song)

        # Serialize the discovered songs
        serializer = SongSerializer(discovered_songs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
