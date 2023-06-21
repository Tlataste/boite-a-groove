import csv

from django.contrib import admin
from django.db.models import Count
from django.db.models.functions import TruncMonth, TruncWeek, TruncDay
from django.http import HttpResponse
from import_export.admin import ImportExportModelAdmin
from .models import *
from users.models import CustomUser


class BoxAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('name', 'description', 'url', 'image_url', 'client_name')


class LocationPointAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('box_id', 'latitude', 'longitude', 'dist_location')


class DepositAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('song_id', 'box_id', 'deposited_at', 'user')
    list_filter = ('song_id', 'box_id', 'deposited_at', 'user')
    search_fields = ('song_id__title', 'box_id__name', 'user')
    ordering = ('-deposited_at',)

    def export_deposits_global(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="deposits_global.csv"'

        writer = csv.writer(response)
        writer.writerow(['Box', 'Period', 'Number of Deposits'])

        # Export by box and month
        deposits_month = Deposit.objects.values('box_id__name').annotate(period=TruncMonth('deposited_at')).values(
            'box_id__name', 'period').annotate(count=Count('id'))
        for deposit in deposits_month:
            writer.writerow([deposit['box_id__name'], deposit['period'].strftime('%Y-%m'), deposit['count']])

        # Export by box and week
        deposits_week = Deposit.objects.values('box_id__name').annotate(period=TruncWeek('deposited_at')).values(
            'box_id__name', 'period').annotate(count=Count('id'))
        for deposit in deposits_week:
            writer.writerow([deposit['box_id__name'], deposit['period'].strftime('%Y-%W'), deposit['count']])

        # Export by box and day
        deposits_day = Deposit.objects.values('box_id__name').annotate(period=TruncDay('deposited_at')).values(
            'box_id__name', 'period').annotate(count=Count('id'))
        for deposit in deposits_day:
            writer.writerow([deposit['box_id__name'], deposit['period'].strftime('%Y-%m-%d'), deposit['count']])

        return response

    export_deposits_global.short_description = "Export deposits as CSV"

    def export_deposits_distribution(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="deposits_distribution.csv"'

        writer = csv.writer(response)
        writer.writerow(['Box', 'Week', 'Day', 'Number of Deposits'])

        # Export by box, week and day
        deposits = Deposit.objects.values('box_id__name').annotate(week=TruncWeek('deposited_at'),
                                                                   day=TruncDay('deposited_at')).values('box_id__name',
                                                                                                        'week',
                                                                                                        'day').annotate(
            count=Count('id'))
        for deposit in deposits:
            writer.writerow(
                [deposit['box_id__name'], deposit['week'].strftime('%Y-%W'), deposit['day'].strftime('%Y-%m-%d'),
                 deposit['count']])

        return response

    export_deposits_distribution.short_description = "Export deposits distribution as CSV"

    def export_active_users_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="active_users.csv"'

        writer = csv.writer(response)
        writer.writerow(['User', 'Box', 'Period', 'Number of Deposits'])

        # Export active users globally by month
        active_users_month = CustomUser.objects.filter(deposit__isnull=False).annotate(
            period=TruncMonth('deposit__deposited_at')).values('username', 'period').annotate(
            count=Count('deposit__id'))
        for user in active_users_month:
            writer.writerow([user['username'], 'Global', user['period'].strftime('%Y-%m'), user['count']])

        # Export active users globally by week
        active_users_week = CustomUser.objects.filter(deposit__isnull=False).annotate(
            period=TruncWeek('deposit__deposited_at')).values('username', 'period').annotate(count=Count('deposit__id'))
        for user in active_users_week:
            writer.writerow([user['username'], 'Global', user['period'].strftime('%Y-%W'), user['count']])

        # Export active users by box and month
        active_users_box_month = CustomUser.objects.filter(deposit__isnull=False).annotate(
            period=TruncMonth('deposit__deposited_at')).values('username', 'deposit__box_id__name', 'period').annotate(
            count=Count('deposit__id'))
        for user in active_users_box_month:
            writer.writerow(
                [user['username'], user['deposit__box_id__name'], user['period'].strftime('%Y-%m'), user['count']])

        # Export active users by box and week
        active_users_box_week = CustomUser.objects.filter(deposit__isnull=False).annotate(
            period=TruncWeek('deposit__deposited_at')).values('username', 'deposit__box_id__name', 'period').annotate(
            count=Count('deposit__id'))
        for user in active_users_box_week:
            writer.writerow(
                [user['username'], user['deposit__box_id__name'], user['period'].strftime('%Y-%W'), user['count']])

        return response

    export_active_users_csv.short_description = "Export active users as CSV"

    def export_popular_songs_csv(self, request, queryset):
        import csv
        from django.http import HttpResponse

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="popular_songs.csv"'

        writer = csv.writer(response)
        writer.writerow(['Song', 'Month', 'Week', 'Day', 'Total Deposits'])

        # Perform your database queries and generate the data for CSV export
        # Replace the following code with your own logic
        popular_songs_by_month = Deposit.objects.filter().count()
        popular_songs_by_week = Deposit.objects.filter().count()
        popular_songs_by_day = Deposit.objects.filter().count()
        total_deposits_by_song = Deposit.objects.count()

        writer.writerow(['', '', '', '', popular_songs_by_month])
        writer.writerow(['', '', '', '', popular_songs_by_week])
        writer.writerow(['', '', '', '', popular_songs_by_day])
        writer.writerow(['', '', '', '', total_deposits_by_song])

        return response

    export_popular_songs_csv.short_description = "Export popular songs as CSV"

    actions = ['export_deposits_global', 'export_deposits_distribution', 'export_active_users_csv',
               'export_popular_songs_csv']


admin.site.site_header = "Administration de la Boîte à Son"
admin.site.register(Box, BoxAdmin)
admin.site.register(Deposit, DepositAdmin)
admin.site.register(Song)
admin.site.register(LocationPoint, LocationPointAdmin)
admin.site.register(VisibleDeposit)
