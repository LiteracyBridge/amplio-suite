import functools
from typing import Any

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from utils import get_db_url
from core.types import HandlerT, LambdaDict, LambdaContext


def get_db() -> HandlerT:
    """
    Get a db connections.
    On error, rollback the transaction
    """
    def decorator(handler: HandlerT) -> HandlerT:
        @functools.wraps(handler)
        def wrapper(event: LambdaDict, context: LambdaContext, *args: Any):
            try:
                DATABASE_URL: str = get_db_url()
                engine = create_engine(DATABASE_URL)
                session: Session = sessionmaker(bind=engine)()

                return handler(event, context, session, *args)
            except:
                session.rollback()
                raise
            finally:
                session.close()
        return wrapper
    return decorator
