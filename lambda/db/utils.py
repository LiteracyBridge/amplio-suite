import sqlalchemy.types as types
from psycopg2.extensions import AsIs


class Point(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Point({self.x}, {self.y})"


class PGPoint(types.UserDefinedType):
    def get_col_spec(self, **kw):
        return "POINT"

    def bind_processor(self, dialect):
        def process(value):
            if value:
                return AsIs("POINT({0}, {1})".format(value.x, value.y))
            else:
                return None
        return process

    def result_processor(self, dialect, coltype):
        def process(value):
            if value:
                x, y = value.lstrip("(").rstrip(")").split(",")
                return Point(float(x), float(y))
            else:
                return None

        return process
