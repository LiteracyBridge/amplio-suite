from sqlalchemy.orm import Session

from db import get_db
from core import router
from languages import controller, schemas


@router(response_model=schemas.Language)
def get_languages(db: Session = get_db()):
    return controller.get_multi(db=db)
