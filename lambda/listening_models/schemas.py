from db import BaseSchema


class ListeningModel(BaseSchema):
    id: int
    label: str
    img_url: str
