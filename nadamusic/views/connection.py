from pyramid.view import (view_config, view_defaults)
from pyramid.httpexceptions import (HTTPFound,HTTPForbidden)
from pyramid.path import AssetResolver

from ..models.connection import Connection
from ..services.connection import ConnectionService

import json
import requests

class AuthViews:
    def __init__(self, request):
        self.request = request
        resolver = AssetResolver()
        file_path = resolver.resolve('nadamusic:integrations.json').abspath()
        with open(file_path) as f:
            creds = json.load(f)
        self.client_id = creds['client_id']
        self.client_secret = creds['client_secret']
        self.redirect_uri = creds['redirect_uri']
        self.scope = creds['scope']

    # /howdy 
    @view_config(route_name='hello')
    def hello(self):

        # set auth paramters
        authorization_url = 'https://accounts.google.com/o/oauth2/v2/auth?client_id='+self.client_id+'&redirect_uri='+self.redirect_uri+'&response_type=code&access_type=offline&scope='+self.scope
        print(authorization_url)

        # redirect to auth server
        return HTTPFound(location=authorization_url)

        # google prompts for user consent
        

    # /callback url from google
    @view_config(route_name='callback')
    def callback(self):

        # handle oauth response
        code = self.request.GET.get('code')
        error = self.request.GET.get('error')

        try:

            # exchange code for refresh and access token
            url = "https://oauth2.googleapis.com/token"

            payload = {'code': code,
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'grant_type': 'authorization_code',
            'redirect_uri': self.redirect_uri}

            response = requests.post(url, data = payload)
            creds = response.json()
            print(creds)
            token = creds['access_token']
            profile_url = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token="+ token
            profile_response = requests.get(profile_url)
            profile_info = profile_response.json()
            print("profile info",profile_info)
            title = profile_info['given_name'] +' - '+ profile_info['email']
            print(title)
            is_exists = self.request.dbsession.query(Connection).filter_by(title=title).scalar()
            if is_exists:
                print("connection already exists", is_exists)

            else:
                refresh_token = creds['refresh_token']
                print("creating new connection", token)
                self.request.dbsession.add(Connection(title=title, token=token, refresh_token=refresh_token))
                # transaction.commit()
            
        except Exception as exp:
            print('====================error=========================')
            print(exp)
        # return response
        connections = ConnectionService.all(self.request)
        print(connections)
        url = self.request.route_url('home', _query="connections")
        return HTTPFound(location=url)

@view_config(route_name='connection_spec', renderer='json')
def connection_spec(request):
    connection_id = request.json_body['id']
    print(connection_id)
    if connection_id:
        # connection = DBSession.query(Connection).filter_by(uid=connection_id).one()
        connection = ConnectionService.by_id(connection_id, request)
        data = get_google_drive_files(connection.token)
        print(data)
        if 'error' in data:
            refreshed = fetch_refresh_token(connection.token, connection.refresh_token)
            print(refreshed)
            connection.token = refreshed['access_token']
            data = get_google_drive_files(refreshed['access_token'])

        if 'items' in data:
            print(data['items'])
        # for item in data['items']:
            # audio/x-m4a
            return { 'status': 200, 'items': data['items'] }
    
    return { 'status': 404 }
    
@view_config(route_name='delete_connection', renderer='json')
def delete_connection(request):
    connection_id = request.json_body['id']
    print(connection_id)
    connection = ConnectionService.by_id(connection_id, request)
    print(connection)
    status_code = 202
    try:
        request.dbsession.delete(connection)
        # transaction.commit()
    except Exception as exp:
        print(exp)
        status_code = 500
    return { 'status': status_code }

# First view, available at /
@view_config(route_name='list_connection', renderer='json')
def list_connections(request):
    connections = ConnectionService.all(request)
    print(connections)
    connection_json = []
    for connection in connections:
        connection_json.append({
            'title': connection.title,
            'id': connection.uid
        })
    return {'connections': connection_json}

def fetch_refresh_token(token, refresh_token):
    resolver = AssetResolver()
    file_path = resolver.resolve('nadamusic:integrations.json').abspath()
    with open(file_path) as f:
        creds = json.load(f)
    url = "https://oauth2.googleapis.com/token"

    payload = {'client_id': creds['client_id'],
    'client_secret': creds['client_secret'],
    'grant_type': 'refresh_token',
    'refresh_token': refresh_token}

    print(payload)

    response = requests.post(url, data = payload)
    return response.json()

def get_google_drive_files(token):
    url = "https://www.googleapis.com/drive/v2/files?q=mimeType  contains  'audio/x-m4a' or mimeType contains 'audio/mp3' or mimeType contains 'audio/mpeg'"
    print(token)
    payload = {}
    headers = {
    'Authorization': "Bearer "+token
    }
    response = requests.request("GET", url, headers=headers, data = payload)
    return response.json()
