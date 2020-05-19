"""create program_sdg table

Revision ID: 085c9fdc81c4
Revises: 039c39497278
Create Date: 2020-05-19 17:03:23.733617

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '085c9fdc81c4'
down_revision = '039c39497278'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'program_sdg',
        sa.Column('program_id', sa.Integer, nullable=False),
        sa.Column('sdg', sa.String(50), nullable=False)
    )


def downgrade():
    op.drop_table('program_sdg')
