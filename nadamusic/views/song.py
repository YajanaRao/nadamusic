from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPFound
from ..models.song import Song
from ..services.song import SongService


@view_config(route_name='song',
             renderer='nadamusic:templates/view_blog.jinja2')
def song_view(request):
    song_id = request.json_body['id']
    entry = SongService.by_id(song_id, request)
    if not entry:
        return HTTPNotFound()
    return {'entry': entry}

# add songs


@view_config(route_name='song_action', match_param='action=create',
             renderer='json',
             permission='create')
def song_create(request):
    if request.method == 'POST' and request.authenticated_userid:
        songs = request.json_body['songs']
        print(songs)
        for song in songs:
            request.dbsession.add(
                Song(title=song['title'], source=song['webContentLink']))
        # source = request.json_body['source']
        # request.dbsession.add(Song(title=title, source=source))
        return {'status': 201}
    return {'status': 500}


@view_config(route_name='song_action', match_param='action=edit',
             renderer='json',
             permission='create')
def song_update(request):
    song_id = request.json_body['id']
    entry = SongService.by_id(song_id, request)
    if not entry:
        return HTTPNotFound()
    # form = BlogUpdateForm(request.POST, entry)
    # if request.method == 'POST' and form.validate():
    #     del form.id  # SECURITY: prevent overwriting of primary key
    #     form.populate_obj(entry)
    #     return HTTPFound(
    #         location=request.route_url('blog', id=entry.id,slug=entry.slug))
    # return {'form': form, 'action': request.matchdict.get('action')}
    return {'status': 'work in progress'}
