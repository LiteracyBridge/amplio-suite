from typing import List

from sqlalchemy.orm import Session

from db import CRUDBase
from deployments import models, schemas
from playlists.controller import crud as playlists_crud

class CRUDDeployment(CRUDBase[models.Deployment, schemas.DeploymentCreate, schemas.DeploymentCreate]):
    def create_deployment(
        self, db: Session, obj_in: schemas.DeploymentCreate, languages_codes: List[str]
    ) -> models.Deployment:
        deployment = self.create(db=db, obj_in=obj_in)

        playlist_in = {
            "program_code": deployment.program_code,
            "deployment_id": deployment.id,
        }
        playlists_crud.create_playlist(
            db=db, obj_in=playlist_in, languages_codes=languages_codes
        )

        db.refresh(deployment)
        return deployment

    def get_by_multi(
        self, db: Session, id: str, program_code: str
    ) -> models.Deployment:
        return (
            db.query(self.model)
            .filter(self.model.id == id)
            .filter(self.model.program_code == program_code)
            .first()
        )


crud = CRUDDeployment(models.Deployment)
