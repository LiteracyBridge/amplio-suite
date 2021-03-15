from sqlalchemy.orm import Session

from core.decorators import format_request_response
from db import get_db
from supported_categories import controller


@get_db()
@format_request_response()
def get_supported_categories(even, context, db: Session):
    return controller.get_multi(db=db)
