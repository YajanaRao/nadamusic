from pyramid.view import (view_config, view_defaults)
from pyramid.httpexceptions import (HTTPFound, HTTPForbidden)
from pyramid.path import AssetResolver

import json


class Integrations:
    def __init__(self, request):
        self.request = request
        resolver = AssetResolver()
        file_path = resolver.resolve('nadamusic:integrations.json').abspath()
        with open(file_path) as f:
            self.integrations = json.load(f)

    @view_config(route_name='integrations', renderer='json')
    def list_integrations(self):
        integrations_json = []
        for integration in self.integrations:
            print(integration)
            integrations_json.append({'name': integration['name'],
                                      'key': integration['key'],
                                      'type': integration['type']
                                      })
        return {'status': 200, 'integrations': integrations_json}
