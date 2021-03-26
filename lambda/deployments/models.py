from sqlalchemy import (
    Column,
    Date,
    Integer,
    String,
    ForeignKeyConstraint,
    UniqueConstraint,
)
from sqlalchemy.orm import validates, relationship
from sqlalchemy_serializer import SerializerMixin

from db import BaseModel

class Deployment(BaseModel, SerializerMixin):
    __tablename__ = "deployments"
    __table_args__ = (
        UniqueConstraint(
            'project',
            'deployment',
            name='deployments_uniqueness_key',
        ),
        ForeignKeyConstraint(
            ['project'],
            ['projects.projectcode'],
            name='deployment_program_code_fkey',
        ),
    )
    id = Column(
        'deploymentnumber',
        Integer,
        primary_key=True,
        index=True,
        nullable=False,
        autoincrement=False,
    )
    program_code = Column(
        'project', String(255), primary_key=True, index=True, nullable=False
    )
    name = Column('deploymentname', String(255))
    deployment = Column('deployment', String(255))
    start_date = Column('startdate', Date)
    end_date = Column('enddate', Date)
    distribution = Column(String(255))
    comment = Column(String)
    component = Column(String, nullable=False)

    playlists = relationship(
        'Playlist',
        cascade="all, delete",
        passive_deletes=True,
        order_by='Playlist.position',
    )
