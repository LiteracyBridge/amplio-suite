from db import get_db
from projects.models import Project

session = next(get_db())

if session.query(Project).count() > 0:
  print("Skiping seeding sample projects because there already exist some projects")
  exit()

sample_projects = {"TEST":"My first test program", "TEST2":"Some second program", "MY-TEST-8":"Really getting the hang, with the eighth"}
PROJECTS = [Project(id=1, program_code=code, name=sample_projects.get(code))
            for i, code in enumerate(sample_projects.keys())]

session.bulk_save_objects(PROJECTS)
session.commit()

session.close()
