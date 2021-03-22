from db import CRUDBase
from roadmaps import models, schemas


crud = CRUDBase[models.Roadmap, schemas.RoadmapCreate, schemas.RoadmapUpdate](
    models.Roadmap
)

