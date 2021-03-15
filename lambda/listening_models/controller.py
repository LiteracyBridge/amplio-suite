from typing import List

from sqlalchemy.orm import Session

from listening_models import models


def get_multi(db: Session) -> List[models.ListeningModel]:
    return db.query(models.ListeningModel).all()
