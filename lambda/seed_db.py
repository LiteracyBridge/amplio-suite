from db import get_db
from projects.models import Project

session = next(get_db())

sample_projects = ["TEST", "TEST2", "My Test Program 8"]
PROJECTS = [Project(id=1, program_code=code, name=code)
            for i, code in enumerate(sample_projects)]

session.bulk_save_objects(PROJECTS)
session.commit()

session.close()
