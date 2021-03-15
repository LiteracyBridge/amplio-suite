from db import CRUDBase
from recipients import models, schemas


crud = CRUDBase[models.Recipient, schemas.RecipientCreate, schemas.RecipientUpdate](
    models.Recipient
)
