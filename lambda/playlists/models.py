from sqlalchemy import Column, Integer, String, UniqueConstraint, ForeignKey, ForeignKeyConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import select, func
from sqlalchemy_serializer import SerializerMixin

from db import BaseModel
from utils import create_db_session
from messages.models import Message


class Playlist(BaseModel, SerializerMixin):
    __tablename__ = 'playlists'
    __table_args__ = (
        UniqueConstraint(
            'program_code',
            'deployment_id',
            'position',
            name='playlist_uniqueness_key'
        ),
        UniqueConstraint(
            'program_code',
            'deployment_id',
            'title',
            name='playlist_title_uniqueness_key',
        ),
        ForeignKeyConstraint(
            ['program_code'],
            ['projects.projectcode'],
            name='playlist_program_code_fkey',
        ),
        ForeignKeyConstraint(
            ['deployment_id'],
            ['deployments.id'],
            name='playlist_deployment_fkey',
            ondelete='CASCADE',
        ),
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        nullable=False,
        autoincrement=True,
    )
    program_code = Column(
        String, primary_key=True, index=True, nullable=False
    )
    deployment_id = Column(Integer, nullable=False)
    position = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    audience = Column(String)

    messages = relationship(
        'Message',
        passive_deletes=True,
        order_by='Message.position',
    )

    def __init__(self, **kwargs):
        """
        Set default value for position and title
        """
        session = create_db_session()
        query = select([func.coalesce(func.max(Playlist.position), 0)]) \
            .where(Playlist.program_code == kwargs['program_code']) \
            .where(Playlist.deployment_id == kwargs['deployment_id'])

        position = session.execute(query).scalar() + 1
        kwargs['position'] = position
        kwargs['title'] = f"Playlist {position}"

        super(Playlist, self).__init__(**kwargs)
