from sqlalchemy import Column, String, Boolean, UniqueConstraint
from sqlalchemy_serializer import SerializerMixin

from models.base import Base

class Category(Base, SerializerMixin):
    __tablename__ = "supportedcategories"
    __table_args__ = (
        UniqueConstraint('categorycode', 'parentcategory', name='supportedcategories_parentcategory_fkey'),
    )

    code = Column("categorycode", String, primary_key=True)
    parent_category = Column("parentcategory", String)
    is_leaf = Column("isleafnode", Boolean, nullable=False)
    name = Column("categoryname", String, nullable=False)
    full_name = Column("fullname", String, nullable=False)
