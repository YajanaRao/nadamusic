from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPFound
from ..models.song import Song
from ..services.song import SongService


@view_config(route_name='song',
             renderer='json')
def song_view(request):
    song_id = request.json_body['id']
    entry = SongService.by_id(song_id, request)
    if not entry:
        return HTTPNotFound()
    return {'song': entry}

# add songs


@view_config(route_name='song_action', match_param='action=list', renderer='json', permission='view')
def list_song(request):
    songs = SongService.all(request)
    songs_json = []
    for song in songs:
        songs_json.append({
            'title': song.title,
            'source': song.source,
            'id': song.id
        })
    return {'songs': songs_json}


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


@view_config(route_name='song_action', match_param='action=delete', renderer='json', permission='create')
def song_delete(request):
    if request.method == 'POST' and request.authenticated_userid:
        song_id = request.json_body['id']
        song = SongService.by_id(song_id, request)
        if song_id:
            request.dbsession.delete(song)
            return {'status': 202}
        else:
            return {'status': 204}


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
