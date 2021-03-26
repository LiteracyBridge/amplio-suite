from sqlalchemy.orm import Session

from db import CRUDBase
from programs import models, schemas
from recipients import models as recipients_models
from roadmaps.controller import crud as roadmaps_crud
from deployments.controller import crud as deployments_crud


class CURDProgram(CRUDBase[models.Program, schemas.ProgramCreate, schemas.ProgramUpdate]):
    def create_program(
        self, db: Session, obj_in: schemas.ProgramCreate
    ) -> models.Program:
        program = self.create(db=db, obj_in=obj_in)

        for deployments_obj in program.default_deployments():
            deployments_crud.create_deployment(
                db=db, obj_in=deployments_obj, languages_codes=program.languages
            )

        roadmap_obj = {
            "program_code": program.program_code,
            "completed": [1],
        }
        roadmaps_crud.create(db=db, obj_in=roadmap_obj)

        db.refresh(program)
        return program


    def update_program(
        self, db: Session, obj_in: schemas.ProgramUpdate
    ) -> models.Program:
        program = self.get_by_program_code(
            db=db, program_code=obj_in.program_code
        )
        program = self.update(db=db, db_obj=program, obj_in=obj_in)

        db.query(recipients_models.Recipient) \
            .filter(recipients_models.Recipient == program.program_code) \
            .update({
                "country": program.country,
                "partner": program.partner,
                "affiliate": program.affiliate,
            })

        return program


    def create_next_deployment(
        self, db: Session, program_code: str
    ) -> models.Program:
        program = self.get_by_program_code(db=db, program_code=program_code)
        deployment_obj = program.next_deployment()

        return deployments_crud.create_deployment(
            db=db, obj_in=deployment_obj, languages_codes=program.languages
        )


crud = CURDProgram(models.Program)
