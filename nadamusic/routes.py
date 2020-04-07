def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('index', '/')
    config.add_route('blog', '/blog/{id:\d+}/{slug}')
    config.add_route('blog_action', '/blog/{action}',
                     factory='nadamusic.security.BlogRecordFactory')
    config.add_route('auth', '/sign/{action}')

    # auth
    config.add_route('login', '/login')
    config.add_route('register', '/register')

    # song
    config.add_route('song', '/api/song/{id:\d+}/{slug}')
    config.add_route('song_action', '/api/song/{action}',
                     factory='nadamusic.security.SongFactory')

    # api
    config.add_route('connection_spec', 'api/connection/spec')
    config.add_route('delete_connection', 'api/connection/delete')
    config.add_route('list_connection', 'api/connection/list')

    # connection
    config.add_route('home', '/home')
    config.add_route('hello', '/howdy')
    config.add_route('callback', '/callback')
