from sqlalchemy import Column, String, JSON, UniqueConstraint, ForeignKey
from sqlalchemy_serializer import SerializerMixin

from models.base import Base

def message_template(index):
    return {
        'title': f"Message Title {index}",
        'language': '',
        'format': '',
        'default_category': '',
        'variant': '',
        'sdg_goal': '',
        'sdg_target': '',
        'key_point': ''
    }

def playlist_template(title):
    return {
        'title': f'{title}',
        'audience': '',
        'messages': [
            message_template(1)
        ]
    }

class Content(Base, SerializerMixin):
    __tablename__ = 'content'
    __table_args__ = (
        UniqueConstraint('program_code', 'deployment_id', name='content_uniqueness_key'),
    )
    program_code = Column(String(255), primary_key=True)
    deployment_id = Column(String(255), ForeignKey('deployments.deployment'), primary_key=True)
    content = Column(JSON, nullable=False)

    def __init__(self, program_code, deployment_id, content=[]):
        self.program_code = program_code
        self.deployment_id = deployment_id
        self.content = content

        if content == []:
            self.add_empty_playlist()

    def add_empty_playlist(self):
        total = len(self.content)
        titles = [playlist['title'] for playlist in self.content]

        while True:
            total += 1
            title = f'Playlist {total}'
            if title not in titles:
                break

        new_playlist = playlist_template(title)
        self.content.append(new_playlist)

        return new_playlist

    def add_empty_message(self, playlist_index):
        total = len(self.content[playlist_index]['messages'])
        titles = [message['title'] for message in self.content[playlist_index]['messages']]

        while True:
            total += 1
            title = f'Message Title {total}'
            if title not in titles:
                break

        new_message = self.content[playlist_index]['messages'][-1].copy()
        new_message['title'] = title
        new_message['key_point'] = ''
        self.content[playlist_index]['messages'].append(new_message)

        return new_message
