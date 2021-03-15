from sqlalchemy.orm import Session

from db import CRUDBase
from projects import models, schemas


class CRUDProject(CRUDBase[models.Project, schemas.ProjectCreate, schemas.ProjectUpdate]):
    def create_project(
        self, db: Session, obj_in: schemas.ProjectCreate
    ) -> models.Project:
        project = (
            db.query(models.Project)
            .filter(
                models.Project.program_code.ilike(obj_in['program_code'].lower())
            )
            .first()
        )
        return crud.update(
            db=db, db_obj=project, obj_in=obj_in
        )

crud = CRUDProject(models.Project)
