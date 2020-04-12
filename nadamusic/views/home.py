from pyramid.view import (view_config, view_defaults)
from pyramid.response import Response
from pyramid.httpexceptions import (HTTPFound, HTTPForbidden)

import requests

from ..models import Connection
from ..services.song import SongService


# First view, available at /
@view_config(route_name='home', renderer='nadamusic:templates/home.jinja2')
def home(request):
    print("auth", request.authenticated_userid)
    if not request.authenticated_userid:
        return HTTPFound(location=request.route_url('login'))
    return {'loaded': True}
