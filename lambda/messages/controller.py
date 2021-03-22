from typing import Union, Dict, Any, List

from sqlalchemy.orm import Session

from db import CRUDBase
from messages import models, schemas


class CRUDMessage(CRUDBase[models.Message, schemas.MessageCreate, schemas.MessageUpdate]):
    def create_message(
        self,
        db: Session,
        obj_in: schemas.MessageCreate,
        languages_codes: List[str],
    ) -> models.Message:
        message = crud.create(db=db, obj_in=obj_in)

        message_langs = [models.MessageLanguages(
            message_id=message.id,
            language_code=code,
        ) for code in languages_codes]
        db.add_all(message_langs)

        db.refresh(message)
        return message

    def update_message(
        self,
        db: Session,
        db_obj: models.Message,
        obj_in: Union[schemas.MessageUpdate, Dict[str, Any]],
    ) -> models.Message:
        message = self.update(
            db=db, db_obj=db_obj, obj_in=obj_in
        )

        db_langs_codes = [lang.code for lang in message.languages]
        obj_in['languages'] = [lang['code'] for lang in obj_in['languages']]
        new_codes = [lang for lang in obj_in['languages'] if lang not in db_langs_codes]
        remove_codes = [lang for lang in db_langs_codes if lang not in obj_in['languages']]

        message_langs = [models.MessageLanguages(
            message_id=message.id,
            language_code=code,
        ) for code in new_codes]
        db.add_all(message_langs)

        db.query(models.MessageLanguages) \
            .filter(
                models.MessageLanguages.message_id == message.id,
                models.MessageLanguages.language_code.in_(remove_codes),
            ) \
            .delete(synchronize_session='fetch')

        return message


crud = CRUDMessage(models.Message)
