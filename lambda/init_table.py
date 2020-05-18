import psycopg2

from utils import get_connection_config

create_programs = """
BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'time_length') THEN
        CREATE TYPE time_length AS ENUM ('1 month', '1 quarter',
                                         'six months', 'one year');
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'time_period') THEN
        CREATE TYPE time_period AS ENUM ('weekly', 'bi-weekly', 'monthly', 'quarterly',
                                         'semi-annually', 'annually', 'not applicable');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS programs(
    id                  SERIAL       PRIMARY KEY,
    name                VARCHAR(50)  UNIQUE NOT NULL,

    amount_deployment   INT          NOT NULL CHECK (amount_deployment > 0),
    deployment_length   time_length,
    first_deployment    DATE    NOT NULL CHECK (first_deployment >= NOW()),

    feedback_frequency  time_period,
    feedback_frequency2 time_period
);
"""

create_sdg = """
CREATE TABLE IF NOT EXISTS sdg(
    id                  INT          PRIMARY KEY,
    name                TEXT         UNIQUE NOT NULL
)
"""

create_program_sdg = """
CREATE TABLE IF NOT EXISTS program_sdg(
    program_id          INT          NOT NULL,
    sdg_id              INT          NOT NULL
)
"""

create_program_listening_model = """
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'listening_model') THEN
        CREATE TYPE listening_model AS ENUM ('households', 'groups',
                                             'community workers', 'place-based');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS program_listening_model(
    program_id          INT             NOT NULL,
    name                listening_model NOT NULL
)
"""

insert_sdg = """
INSERT INTO sdg(id, name)
    VALUES (%s, %s)
    ON CONFLICT (id) DO UPDATE
    SET name = excluded.name
"""

sdg = [
    (0, 'No Poverty'), (1, 'Zero Hunger'), (2, 'Good health and well being'),
    (3, 'Quality education'), (4, 'Gender Equality'), (5, 'Clean water and sanitation'),
    (6, 'Affordable and clean energy'), (7, 'Decent work and economic growth'),
    (8, 'Industry, innovation and infrastructure'), (9, 'Reduced inequalities'),
    (10, 'Sustainable cities and communities'), (11, 'Responsible consumption and production'),
    (12, 'Climate action'), (13, 'Life below water'), (14, 'Life on land'),
    (15, 'Peace, justice and strong institutions'),
    (16, 'Parternship for the goals')]


def lambda_handler(event, context):
    # Connect with the db
    config = get_connection_config()
    connection = psycopg2.connect(config)
    cursor = connection.cursor()

    # Create the table
    for q in [create_programs, create_sdg, create_program_sdg,
              create_program_listening_model]:
        cursor.execute(q)
    connection.commit()

    # Populate the tables
    cursor.executemany(insert_sdg, sdg)
    connection.commit()

    return {
        'statusCode': 200,
        'message': 'tables created successfully'
    }
