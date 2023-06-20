import csv

from django.contrib import admin
from django.db.models import Count
from django.db.models.functions import TruncMonth, TruncWeek, TruncDay
from django.http import HttpResponse
from import_export.admin import ImportExportModelAdmin
from .models import *


class BoxAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('name', 'description', 'url', 'image_url', 'client_name')


class LocationPointAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('box_id', 'latitude', 'longitude', 'dist_location')


class DepositAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('song_id', 'box_id', 'deposited_at', 'user')
    list_filter = ('song_id', 'box_id', 'deposited_at', 'user')
    search_fields = ('song_id__title', 'box_id__name', 'user')
    ordering = ('-deposited_at',)

    def export_deposits_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="deposits.csv"'

        writer = csv.writer(response)
        writer.writerow(['Month', 'Week', 'Day', 'Total Deposits'])

        # Perform database queries to get deposit counts by month, week, and day
        deposits_by_month = Deposit.objects.values('deposited_at__month').annotate(total=Count('id')).values(
            'deposited_at__month', 'total')
        deposits_by_week = Deposit.objects.values('deposited_at__week').annotate(total=Count('id')).values(
            'deposited_at__week', 'total')
        deposits_by_day = Deposit.objects.values('deposited_at__date').annotate(total=Count('id')).values(
            'deposited_at__date', 'total')
        total_deposits = Deposit.objects.count()

        # Write data to CSV
        for month in deposits_by_month:
            writer.writerow([month['deposited_at__month'], '', '', month['total']])
        for week in deposits_by_week:
            writer.writerow(['', week['deposited_at__week'], '', week['total']])
        for day in deposits_by_day:
            writer.writerow(['', '', day['deposited_at__date'], day['total']])
        writer.writerow(['', '', '', total_deposits])

        return response

    export_deposits_csv.short_description = "Export deposits as CSV"

    def export_deposits_by_week_and_day_csv(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="deposits_by_week_and_day.csv"'

        writer = csv.writer(response)
        writer.writerow(['Week', 'Day', 'Total Deposits'])

        # Perform database queries to get deposit counts by week and day
        deposits_by_week = Deposit.objects.annotate(week=TruncWeek('deposited_at')).values('week').annotate(
            total=Count('id')).values('week', 'total')
        deposits_by_day = Deposit.objects.annotate(day=TruncDay('deposited_at')).values('day').annotate(
            total=Count('id')).values('day', 'total')

        # Write data to CSV
        for week in deposits_by_week:
            writer.writerow([week['week'].strftime('%U, %Y'), '', week['total']])
        for day in deposits_by_day:
            writer.writerow(['', day['day'].strftime('%Y-%m-%d'), day['total']])

        return response

    export_deposits_by_week_and_day_csv.short_description = "Export deposits by week and day as CSV"

    def export_active_users_csv(self, request, queryset):
        import csv
        from django.http import HttpResponse

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="active_users.csv"'

        writer = csv.writer(response)
        writer.writerow(['User', 'Month', 'Week', 'Total Deposits'])

        # Perform your database queries and generate the data for CSV export
        # Replace the following code with your own logic
        active_users_by_month = Deposit.objects.filter().count()
        active_users_by_week = Deposit.objects.filter().count()
        total_deposits_by_user = Deposit.objects.count()

        writer.writerow(['', '', '', active_users_by_month])
        writer.writerow(['', '', '', active_users_by_week])
        writer.writerow(['', '', '', total_deposits_by_user])

        return response

    export_active_users_csv.short_description = "Export active users as CSV"

    actions = ['export_deposits_csv', 'export_deposits_by_week_and_day_csv', 'export_active_users_csv',
               'export_popular_songs_csv']

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

admin.site.site_header = "Administration de la Boîte à Son"
admin.site.register(Box, BoxAdmin)
admin.site.register(Deposit, DepositAdmin)
admin.site.register(Song)
admin.site.register(LocationPoint, LocationPointAdmin)
admin.site.register(VisibleDeposit)
