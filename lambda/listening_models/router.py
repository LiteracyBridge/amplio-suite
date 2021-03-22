from sqlalchemy.orm import Session

from db import get_db
from core import router
from listening_models import controller, schemas


@router(response_model=schemas.ListeningModel)
def get_listening_models(db: Session = get_db()):
    return controller.get_multi(db=db)
