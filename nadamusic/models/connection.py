import datetime  # <- will be used to set default dates on models

# <- we need to import our sqlalchemy metadata from which model classes will inherit
from nadamusic.models.meta import Base
from sqlalchemy import (
    Column,
    Text,
    Integer,
    Unicode,
    DateTime  # <- will provide Unicode field
    # <- time abstraction field
)


class Connection(Base):
    __tablename__ = 'connection'
    uid = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    title = Column(Unicode(255), unique=True, nullable=False)
    token = Column(Unicode(255), unique=True, nullable=False)
    refresh_token = Column(Unicode(255), unique=True, nullable=False)
    created = Column(DateTime, default=datetime.datetime.utcnow)
    edited = Column(DateTime, default=datetime.datetime.utcnow)
