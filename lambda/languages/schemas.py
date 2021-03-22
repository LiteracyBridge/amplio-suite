from typing import Optional

from db import BaseSchema


class Language(BaseSchema):
    code: str
    name: str
    comments: Optional[str]
