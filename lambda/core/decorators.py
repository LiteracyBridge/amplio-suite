import functools
from typing import List

from db import BaseModel, BaseSchema
from utils import TableManager
from core.types import LambdaDict, LambdaContext, HandlerT
from core.config import settings, Environment
from core.exceptions import UnauthorizedAccess


def check_user_access() -> HandlerT:
    ""
    def decorator(handler: HandlerT) -> HandlerT:
        @functools.wraps(handler)
        def wrapper(event: LambdaDict, context: LambdaContext, *args):
            if settings.ENVIRONMENT != Environment.DEVELOPMENT:
                email = event['context']['email']
                programs = TableManager.get_instance().get_programs_for_user(email).keys()
                if not (event["program_code"] in programs):
                    return UnauthorizedAccess("Unauthorized user")

            return handler(event, context, *args)
        return wrapper
    return decorator


def format_request_response(
    request_model: List = [],
    response_model: BaseSchema = None,
) -> HandlerT:
    """
    Format input and output using pydantic models
    """
    def decorator(handler: HandlerT) -> HandlerT:
        @functools.wraps(handler)
        def wrapper(event: LambdaDict, context: LambdaContext, *args):
            # Request
            for key in request_model:
                if key not in event:
                    return {
                        'status': 422,
                        'error': f'{key} must be specified'
                    }

            result = handler(event, context, *args)

            # Response
            if not result:
                return {
                    'status': 401,
                    'error': 'Content not found'
                }
            elif isinstance(result, Exception):
                return { "error": result.message, "status": 401 }
            elif (
                response_model and
                isinstance(result, list)):
                return [response_model.from_orm(r).dict(by_alias=True) for r in result]
            elif (
                response_model and
                isinstance(result, BaseModel)):
                return response_model.from_orm(result).dict(by_alias=True)
            elif (
                isinstance(result, list) and
                isinstance(result[0], BaseModel)):
                return [r.to_dict() for r in result]
            elif isinstance(result, BaseModel):
                return result.to_dict()
            else:
                return result
        return wrapper
    return decorator
