import sqlalchemy as sa
from paginate_sqlalchemy import SqlalchemyOrmPage #<- provides pagination
from ..models.connection import Connection


class ConnectionService(object):

    @classmethod
    def all(cls, request):
        query = request.dbsession.query(Connection)
        return query.order_by(sa.desc(Connection.created))

    @classmethod
    def by_id(cls, _id, request):
        query = request.dbsession.query(Connection)
        return query.get(_id)

    @classmethod
    def by_user_id(cls, user_id, request):
        return request.dbsession.query(Connection).filter(Connection.user_id == user_id).all()

    @classmethod
    def get_paginator(cls, request, page=1):
        query = request.dbsession.query(Connection)
        query = query.order_by(sa.desc(Connection.created))
        query_params = request.GET.mixed()

        def url_maker(link_page):
            # replace page param with values generated by paginator
            query_params['page'] = link_page
            return request.current_route_url(_query=query_params)

        return SqlalchemyOrmPage(query, page, items_per_page=5,
                                 url_maker=url_maker)
