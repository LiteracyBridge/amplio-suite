from sqlalchemy import Column, String, JSON, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_serializer import SerializerMixin

Base = declarative_base()

class Content(Base, SerializerMixin):
    __tablename__ = 'content'
    __table_args__ = (
        UniqueConstraint('program_code', 'deployment_id', name='content_uniqueness_key'),
    )
    program_code = Column(String(255), primary_key=True)
    deployment_id = Column(String(255), primary_key=True)
    content = Column(JSON, nullable=False)
