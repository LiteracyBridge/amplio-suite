from sqlalchemy import Column, String, JSON, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_serializer import SerializerMixin


def message_template(index):
    return {
        'title': f"Message Title {index}",
        'language': '',
        'format': '',
        'default_category': '',
        'variant': '',
        'sdg_goal': '',
        'sdg_target': ''
    }

def playlist_template(index):
    return {
        'title': f'Playlist {index}',
        'audience': '',
        'messages': [
            message_template(1)
        ]
    }

Base = declarative_base()

class Content(Base, SerializerMixin):
    __tablename__ = 'content'
    __table_args__ = (
        UniqueConstraint('program_code', 'deployment_id', name='content_uniqueness_key'),
    )
    program_code = Column(String(255), primary_key=True)
    deployment_id = Column(String(255), primary_key=True)
    content = Column(JSON, nullable=False)

    def __init__(self, program_code, deployment_id, content=[]):
        self.program_code = program_code
        self.deployment_id = deployment_id
        self.content = content

        if content == []:
            self.add_empty_playlist()

    def add_empty_playlist(self):
        total = len(self.content)
        playlist = playlist_template(total + 1)
        self.content.append(playlist)

        return playlist

    def add_empty_message(self, playlist_index):
        total = len(self.content[playlist_index]['messages'])
        message = message_template(total + 1)
        self.content[playlist_index]['messages'].append(message)

        return message
