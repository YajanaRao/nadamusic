from pyramid.view import view_config
from pyramid.httpexceptions import HTTPFound
from pyramid.security import remember, forget

from ..services.user import UserService
from ..services.blog_record import BlogRecordService
from ..forms import RegistrationForm, LoginForm
from ..models.user import User


@view_config(route_name='index',
             renderer='nadamusic:templates/index.jinja2')
def index_page(request):
    page = int(request.params.get('page', 1))
    paginator = BlogRecordService.get_paginator(request, page)
    return {'paginator': paginator}


@view_config(route_name='auth', match_param='action=out', renderer='string')
def sign_out(request):
    username = request.POST.get('username')
    user = UserService.by_name(username, request=request)
    if user:
        headers = forget(request, user.name)
        return HTTPFound(location=request.route_url('index'), headers=headers)

@view_config(route_name='login',
             renderer='nadamusic:templates/login.jinja2')
def login(request):
    # next_url = request.params.get('next', request.referrer)
    # if not next_url:
    next_url = request.route_url('home')
    message = ''
    login = ''
    if 'form.submitted' in request.params:
        username = request.params['username']
        password = request.params['password']
        print(username, password)
        # user = UserService.by_name(username, request)
        # print(user)
        user = UserService.by_name(username, request=request)
        print(user)
        if user is not None and user.verify_password(password):
            headers = remember(request, user.id)
            print("login successfull", next_url)
            return HTTPFound(location=next_url, headers=headers)
        message = 'Failed login. Username or password is incorrect'

    return dict(
        message=message,
        url=request.route_url('login'),
        next_url=next_url,
        login=login,
        )



@view_config(route_name='register',
             renderer='nadamusic:templates/register.jinja2')
def register(request):
    form = RegistrationForm(request.POST)
    if request.method == 'POST' and form.validate():
        new_user = User(name=form.username.data)
        new_user.set_password(form.password.data.encode('utf8'))
        request.dbsession.add(new_user)
        return HTTPFound(location=request.route_url('login'))
    return {'form': form}
