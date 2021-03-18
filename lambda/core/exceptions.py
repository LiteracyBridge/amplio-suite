class NotFoundException(Exception):
    def __init__(self, message: str):
        self.status_code = 404
        self.message = message


class UnauthorizedAccess(Exception):
    def __init__(self, message: str):
        self.status_code = 401
        self.message = message
