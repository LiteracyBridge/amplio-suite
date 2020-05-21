"""create program_listening_model table

Revision ID: 2381e9f00dd5
Revises: 085c9fdc81c4
Create Date: 2020-05-19 17:07:27.233890

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2381e9f00dd5'
down_revision = '085c9fdc81c4'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'program_listening_model',
        sa.Column('program_id', sa.Integer, nullable=False),
        sa.Column('listening_model', sa.String(50), nullable=False)
    )


def downgrade():
    op.drop_table('program_listening_model')
