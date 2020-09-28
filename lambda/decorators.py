import functools

def validate_keys(keys):
    """
    Validate if all the necessary keys are in the request
    """
    def decorator(handler):
        @functools.wraps(handler)
        def wrapper(event, context):
            for key in keys:
                if key not in event:
                    return {
                        'status': 422,
                        'error': f'{key} must be specified'
                    }

            return handler(event, context)
        return wrapper
    return decorator
