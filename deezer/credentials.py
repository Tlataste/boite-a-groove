import json

try:
    with open("credential.json") as json_data_file:
        data = json.load(json_data_file)

        APP_ID = data['Credentials'][1]['app_id']
        APP_SECRET = data['Credentials'][1]['app_secret']
        REDIRECT_URI = data['Credentials'][1]['redirect_uri']
except FileNotFoundError as fnfe:
    print(f'\'credential.json\' not found.')
    exit()
