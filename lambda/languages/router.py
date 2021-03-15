from sqlalchemy.orm import Session

from core.decorators import format_request_response
from db import get_db
from languages import controller, schemas


@get_db()
@format_request_response(response_model=schemas.Language)
def get_languages(even, context, db: Session):
    return controller.get_multi(db=db)
