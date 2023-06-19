from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView  # Generic API view
from .serializers import BoxSerializer, SongSerializer, DepositSerializer
from .models import *
from .util import normalize_string, calculate_distance
from django.shortcuts import render


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
                songs = Song.objects.filter(id__in=last_deposit.values('song_id'))
                songs = SongSerializer(songs, many=True).data
                resp = {}
                resp['last_deposits'] = songs
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
        song_name = option.get('name')
        song_author = option.get('artist')
        song_platform_id = option.get('platform_id')
        box_name = request.data.get('boxName')

        # # Normalise the song and artist names
        # song_name = normalize_string(song_name)
        # song_author = normalize_string(song_author)

        # Verify if the song already exists
        try:
            song = Song.objects.filter(title=song_name, artist=song_author, platform_id=song_platform_id).get()
            song.n_deposits += 1
            song.save()

        except Song.DoesNotExist:
            # Create a new song
            song_url = option.get('url')
            song_image = option.get('image_url')
            song_duration = option.get('duration')
            song = Song(title=song_name, artist=song_author, url=song_url, image_url=song_image, duration=song_duration,
                        platform_id=song_platform_id, n_deposits=1)
            song.save()

        # Create a new deposit
        box = Box.objects.filter(name=box_name).get()
        new_deposit = Deposit(song_id=song, box_id=box)
        new_deposit.save()
        new_deposit = DepositSerializer(new_deposit).data
        # Rediriger vers la page de détails de la boîte
        return Response(new_deposit, status=status.HTTP_200_OK)


class ReplaceVisibleDeposits(APIView):
    def post(self, request, format=None):
        # Get the box, the visible deposit disclosed by the user and the search deposit
        box_id = request.data.get('visible_deposit').get('box_id')
        print(request.data.get('visible_deposit'))
        visible_deposit_id = request.data.get('visible_deposit').get('id')
        print(visible_deposit_id)
        print(request.data.get('search_deposit'))
        search_deposit_id = request.data.get('search_deposit').get('id')
        print(search_deposit_id)

        # Get the visible deposits corresponding to the box
        # visible_deposits = VisibleDeposit.objects.select_related("Deposit").select_related("Box").all()\
        #     .filter(box_id=box_id)
        visible_deposits = VisibleDeposit.objects.filter(deposit_id__box_id=box_id)
        print(visible_deposits)

        # Delete the visible deposit disclosed by the user
        visible_deposits.filter(deposit_id=visible_deposit_id).delete()

        # Get the most recent deposit that is not in the visible deposits
        i = 0
        while search_deposit_id in VisibleDeposit.objects.filter(deposit_id__box_id=box_id).values('deposit_id'):
            i += 1
            search_deposit_id = Deposit.objects.filter(box_id=box_id).order_by('-deposited_at')[i].id
            print(search_deposit_id)

        # Create a new visible deposit with the search deposit
        search_deposit = Deposit.objects.filter(id=search_deposit_id).get()
        new_visible_deposit = VisibleDeposit(box_id=box_id, deposit_id=search_deposit)
        return Response({'success': True, 'visible deposit': new_visible_deposit}, status=status.HTTP_200_OK)


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
