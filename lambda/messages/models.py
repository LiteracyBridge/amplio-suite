from sqlalchemy import (
    Column,
    Integer,
    String,
    UniqueConstraint,
    ForeignKey,
    ForeignKeyConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import select, func
from sqlalchemy_serializer import SerializerMixin

from db import BaseModel
from utils import create_db_session
from deployments.models import Deployment
from languages.models import Language
from supported_categories.models import SupportedCategory
from sustainable_developments.models import (
    SustainableDevelopmentGoals,
    SustainableDevelopmentTargets,
)


class MessageLanguages(BaseModel):
    __tablename__ = 'message_languages'

    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(Integer, ForeignKey('messages.id'), nullable=False)
    language_code = Column(String, ForeignKey('supportedlanguages.languagecode'), nullable=False)


class Message(BaseModel, SerializerMixin):
    __tablename__ = 'messages'
    __table_args__ = (
        UniqueConstraint(
            'program_code',
            'playlist_id',
            'position',
            name='message_uniqueness_key'
        ),
        ForeignKeyConstraint(
            ['program_code', 'playlist_id'],
            ['playlists.program_code', 'playlists.id'],
            name='message_program_code_fkey',
            ondelete='CASCADE',
        ),
        ForeignKeyConstraint(
            ['default_category_id'],
            ['supportedcategories.categorycode'],
            name='message_category_fkey',
        ),
        ForeignKeyConstraint(
            ['sdg_goal_id'],
            ['sustainable_development_goals.section'],
            name='message_sdg_goal_fkey',
        ),
        ForeignKeyConstraint(
            ['sdg_goal_id', 'sdg_target_id'],
            [
                'sustainable_development_targets.goal_id',
                'sustainable_development_targets.subsection',
            ],
            name='message_sdg_target_fkey',
        )
    )

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
        nullable=False
    )
    program_code = Column(String, index=True, nullable=False)
    playlist_id = Column(Integer, nullable=False)
    position = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    format = Column(String)
    default_category_id = Column(String)
    variant = Column(String)
    sdg_goal_id = Column(Integer)
    sdg_target_id = Column(Integer)
    key_point = Column(String)

    languages = relationship(
        'Language',
        secondary=MessageLanguages.__tablename__,
        cascade='all, delete',
        order_by='Language.name',
    )

    sdg_goal = relationship(
        'SustainableDevelopmentGoals'
    )
    sdg_target = relationship(
        'SustainableDevelopmentTargets',
        viewonly=True,
        primaryjoin="and_ (Message.sdg_goal_id==SustainableDevelopmentTargets.goal_id,"
        "Message.sdg_target_id==SustainableDevelopmentTargets.subsection)"
    )

    category = relationship(
        'SupportedCategory'
    )

    def __init__(self, **kwargs):
        """
        Set default value for position and title
        """
        session = create_db_session()
        query = select([func.coalesce(func.max(Message.position), 0)]) \
            .where(Message.program_code == kwargs['program_code']) \
            .where(Message.playlist_id == kwargs['playlist_id'])

        position = session.execute(query).scalar() + 1
        kwargs['position'] = position
        kwargs['title'] = f"Message {position}"

        super(Message, self).__init__(**kwargs)
