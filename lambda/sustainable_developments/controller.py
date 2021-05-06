from typing import List

from sqlalchemy.orm import Session

from sustainable_developments import models


def get_multi(db: Session) -> List[models.SustainableDevelopmentGoals]:
    return (
        db.query(models.SustainableDevelopmentGoals)
        .all()
    )
