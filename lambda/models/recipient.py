from sqlalchemy import Column, Integer, String, Date, CheckConstraint, UniqueConstraint
from sqlalchemy.dialects.postgresql import DOUBLE_PRECISION
from sqlalchemy_serializer import SerializerMixin
from models.utils.pgpoint import PGPoint

from models.base import Base

class Recipient(Base, SerializerMixin):
    __tablename__ = "recipients"
    __table_args__ = (
        CheckConstraint('(((recipientid)::text = lower((recipientid)::text)))', name='lowercase_recipientid_check'),
        UniqueConstraint('partner', 'project', 'communityname', 'groupname', 'agent', name='recipients_uniqueness_key'),
    )
    recipientid = Column(String, primary_key=True, nullable=False)
    project = Column(String, nullable=False)
    partner = Column(String, nullable=False)
    communityname = Column(String, nullable=False)
    groupname = Column(String, nullable=False)
    affiliate = Column(String, nullable=False)
    component = Column(String, nullable=False)
    country = Column(String, nullable=False)
    region = Column(String, nullable=False)
    district = Column(String, nullable=False)
    numhouseholds = Column(Integer, nullable=False)
    numtbs = Column(Integer, nullable=False)
    supportentity = Column(String, nullable=False)
    model = Column(String, nullable=False)
    language = Column(String, nullable=False)
    coordinates = Column(PGPoint)
    agent = Column(String, nullable=False)
    latitude = Column(DOUBLE_PRECISION)
    longitude = Column(DOUBLE_PRECISION)
    variant = Column(String)
