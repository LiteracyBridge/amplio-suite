from sqlalchemy import Column, Integer, String, Date, UniqueConstraint
from sqlalchemy.orm import validates, relationship
from sqlalchemy_serializer import SerializerMixin

from models.base import Base
from models.playlist import Playlist

class Deployment(Base, SerializerMixin):
    __tablename__ = "deployments"
    __table_args__ = (
        UniqueConstraint(
            'project',
            'deployment',
            name='deployments_uniqueness_key',
        ),
    )
    id = Column('deployment', String(255), primary_key=True)
    program_code = Column('project', String(255), primary_key=True)
    name = Column('deploymentname', String(255))
    number = Column('deploymentnumber', Integer)
    start_date = Column('startdate', Date)
    end_date = Column('enddate', Date)
    distribution = Column(String(255))
    comment = Column(String)
    component = Column(String, nullable=False)

    playlists = relationship(
        'Playlist',
        passive_deletes=True,
        order_by='Playlist.position',
    )
