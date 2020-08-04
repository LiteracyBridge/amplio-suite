from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy_serializer import SerializerMixin

from models.base import Base

class Category(Base, SerializerMixin):
    __tablename__ = "supportedcategories"

    code = Column("categorycode", String, primary_key=True)
    parent_category = Column("parentcategory", String, ForeignKey("supportedcategories.categorycode"), nullable=True)
    is_leaf = Column("isleafnode", Boolean, nullable=False)
    name = Column("categoryname", String, nullable=False)
    full_name = Column("fullname", String, nullable=False)
