class NotFoundException(Exception):
    def __init__(self, message: str):
        self.message = message


class UnauthorizedAccess(Exception):
    def __init__(self, message: str):
        self.message = message
