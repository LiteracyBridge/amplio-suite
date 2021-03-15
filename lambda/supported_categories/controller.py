from typing import List

from sqlalchemy.orm import Session

from supported_categories import models


def get_multi(db: Session) -> List[models.SupportedCategory]:
    return (
        db.query(models.SupportedCategory)
        .all()
    )
