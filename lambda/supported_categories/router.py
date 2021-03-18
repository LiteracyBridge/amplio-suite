from sqlalchemy.orm import Session

from db import get_db
from core import router
from supported_categories import controller


@router()
def get_supported_categories(db: Session = get_db()):
    return controller.get_multi(db=db)
