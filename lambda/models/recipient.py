from sqlalchemy import Column, Integer, String, Date, JSON, CheckConstraint, UniqueConstraint
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
    recipient_id = Column('recipientid', String, primary_key=True, nullable=False)
    program_code = Column('project', String, nullable=False)
    partner = Column(String, nullable=False)
    community_name = Column('communityname', String, nullable=False)
    group_name = Column('groupname', String, nullable=False)
    affiliate = Column(String, nullable=False)
    component = Column(String, nullable=False)
    country = Column(String, nullable=False)
    region = Column(String, nullable=False)
    district = Column(String, nullable=False)
    num_households = Column('numhouseholds', Integer, nullable=False)
    num_tbs = Column('numtbs', Integer, nullable=False)
    support_entity = Column('supportentity', String, nullable=False)
    model = Column(String, nullable=False)
    language = Column(String, nullable=False)
    coordinates = Column(PGPoint)
    agent = Column(String, nullable=False)
    latitude = Column(DOUBLE_PRECISION)
    longitude = Column(DOUBLE_PRECISION)
    variant = Column(String)

    # New fields
    deployments = Column(JSON)
    agent_gender = Column(String)
    direct_beneficiaries = Column(Integer)
    direct_beneficiaries_additional = Column(JSON)
    indirect_beneficiaries = Column(Integer)
