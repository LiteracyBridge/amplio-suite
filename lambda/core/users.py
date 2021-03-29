from core.config import settings, Environment
from core.exceptions import UnauthorizedAccess
from core.types import LambdaDict, LambdaContext


def get_current_user(event: LambdaDict, context: LambdaContext) -> str:
    if settings.ENVIRONMENT != Environment.DEVELOPMENT:
        return event['request_context']['authorizer']['claims']['email']
    return "admin@amplio.org"


def check_user_access(user_email: str, model):
    pass
