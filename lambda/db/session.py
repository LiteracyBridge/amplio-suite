import functools

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from utils import get_db_url


def get_db():
    def decorator(handler):
        @functools.wraps(handler)
        def wrapper(event, context):
            try:
                DATABASE_URL = get_db_url()
                engine = create_engine(DATABASE_URL)
                session = sessionmaker(bind=engine)()

                return handler(event, context, session)
            except:
                session.rollback()
                raise
            finally:
                session.close()
        return wrapper
    return decorator
