from sqlalchemy.orm import Session

from core.decorators import format_request_response
from db import get_db
from listening_models import controller, schemas


@get_db()
@format_request_response(response_model=schemas.ListeningModel)
def get_listening_models(even, context, db: Session):
    return controller.get_multi(db=db)
