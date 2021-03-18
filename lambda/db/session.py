from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from utils import get_db_url


def get_db() -> Session:
    try:
        DATABASE_URL: str = get_db_url()
        engine = create_engine(DATABASE_URL)
        db = sessionmaker(bind=engine)()

        return db
    except:
        db.rollback()
        raise
    finally:
        db.close()
