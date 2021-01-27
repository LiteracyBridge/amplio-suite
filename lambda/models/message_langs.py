from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

from models.base import Base


class MessageLanguages(Base):
    __tablename__ = 'message_languages'

    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(Integer, ForeignKey('messages.id'), nullable=False)
    language_code = Column(String, ForeignKey('supportedlanguages.languagecode'), nullable=False)
