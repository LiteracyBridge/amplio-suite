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

    id = Column(Integer, primary_key=True)
    program_id = Column('project', String(255), index=True, nullable=False)
    name = Column('deploymentname', String(255), nullable=False)
    number = Column('deploymentnumber', Integer, nullable=False)
    deployment = Column('deployment', String(255), nullable=False)
    start_date = Column('startdate', Date)
    end_date = Column('enddate', Date)
    distribution = Column(String(255))
    comment = Column(String)
    component = Column(String, nullable=False)

    # WTF. This appears to retrieve the playlists associated with this deployment. A more sensible approach would
    # involve, you know, ASKING for the "children".
    # playlists = relationship(
    #     'Playlist',
    #     cascade="all, delete",
    #     passive_deletes=True,
    #     order_by='Playlist.position',
    # )
