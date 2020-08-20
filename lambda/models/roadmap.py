from sqlalchemy import Column, Integer, String, JSON, UniqueConstraint
from sqlalchemy_serializer import SerializerMixin

from models.base import Base

class Roadmap(Base, SerializerMixin):
    __tablename__ = 'roadmap'
    __table_args__ = (
        UniqueConstraint('program_code', name='roadmap_program_code_uniqueness_key'),
    )

    id = Column(Integer, primary_key=True)
    program_code = Column(String, nullable=False)
    completed = Column(JSON, nullable=False)
