from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from utils import get_db_url


def get_db() -> Generator:
    try:
        DATABASE_URL: str = get_db_url()
        engine = create_engine(DATABASE_URL)
        db: Session = sessionmaker(bind=engine)()
        yield db
    except:
        db.rollback()
        raise
    finally:
        db.close()
