import json
import inspect
import functools
from typing import Any, Dict, List, Callable

from pydantic.main import ModelMetaclass

from db import BaseModel, BaseSchema
from utils import TableManager, camel_to_snake
from core.config import settings
from core.types import QueryString, LambdaDict, LambdaContext


def response(status_code: int, body: Dict) -> Dict:
    return {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Origin": str(settings.BACKEND_CORS_ORIGINS),
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        },
        "body": json.dumps(body)
    }


def get_typed_signature(call: Callable[..., Any]) -> inspect.Signature:
    signature = inspect.signature(call)
    typed_params = [
        inspect.Parameter(
            name=param.name,
            kind=param.kind,
            default=param.default,
            annotation=param.annotation,
        )
        for param in signature.parameters.values()
    ]
    typed_signature = inspect.Signature(typed_params)
    return typed_signature


def _prepare_response_content(
    res: Any, response_model
) -> Any:
    if isinstance(res, BaseSchema):
        return res.dict(by_alias=True)
    elif isinstance(res, BaseModel) and response_model:
        return response_model.from_orm(res).dict(by_alias=True)
    elif isinstance(res, BaseModel):
        return res.to_dict()
    elif isinstance(res, list):
        return [
            _prepare_response_content(item, response_model)
            for item in res
        ]
    return res


def router(response_model : BaseSchema = None) -> Any:
    """
    Parse request and response paramenters
    """
    def decorator(handler: Callable) -> Any:
        @functools.wraps(handler)
        def wrapper(event: LambdaDict, context: LambdaContext):
            # Read handle func args
            endpoint_signature = get_typed_signature(handler)
            signature_params = endpoint_signature.parameters

            # Split deps
            body_params = []
            query_params = []
            model_params = []
            callable_params = []
            generator_params = []
            for param_name, param in signature_params.items():
                if (str(param.annotation) == "<class 'core.types.Body'>"):
                    body_params.append(param)
                elif (str(param.annotation) == "<class 'core.types.QueryString'>"):
                    query_params.append(param)
                elif inspect.isgeneratorfunction(param.default):
                    generator_params.append(param)
                elif inspect.isfunction(param.default):
                    callable_params.append(param)
                elif isinstance(param.annotation, ModelMetaclass):
                    model_params.append(param)

            # Validate required query params
            input_query_params = {}
            if 'queryStringParameters' in event and event['queryStringParameters']:
                input_query_params = {camel_to_snake(key): val
                    for key, val in event['queryStringParameters'].items()}
            for param in query_params:
                if param.name not in input_query_params:
                    return response(
                        442, f"{param} must be specified"
                    )

            body = {}
            if "body" in event and event["body"]:
                if isinstance(event["body"], str):
                    body = json.loads(event["body"])
                else:
                    body = event["body"]
            event = {camel_to_snake(key): val for key, val in event.items()}

            body_params = {param.name: body[param.name]
                for param in body_params}
            query_params = {param.name: input_query_params[param.name]
                for param in query_params}
            callable_params = {param.name: param.default(event, context)
                for param in callable_params}
            model_params = {param.name: param.annotation.parse_obj(body)
                for param in model_params}
            generator_params = {param.name: next(param.default())
                for param in generator_params}

            result = handler(
                **body_params,
                **query_params,
                **model_params,
                **callable_params,
                **generator_params,
            )

            # Response
            if not result:
                return response(
                    401, {"error": "Content not found"}
                )
            elif isinstance(result, Exception):
                return response(
                    result.status_code, {"error": result.message}
                )

            return response(
                200, _prepare_response_content(result, response_model)
            )
        return wrapper
    return decorator
