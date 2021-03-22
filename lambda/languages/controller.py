from typing import List

from sqlalchemy.orm import Session

from languages import models


def get_multi(db: Session) -> List[models.Language]:
    return (
        db.query(models.Language)
        .all()
    )
