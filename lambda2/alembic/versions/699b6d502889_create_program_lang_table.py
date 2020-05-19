"""create program_lang table

Revision ID: 699b6d502889
Revises: 2381e9f00dd5
Create Date: 2020-05-19 17:09:34.178676

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '699b6d502889'
down_revision = '2381e9f00dd5'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'program_lang',
        sa.Column('program_id', sa.Integer, nullable=False),
        sa.Column('lang', sa.String(50), nullable=False)
    )


def downgrade():
    op.drop_table('program_lang')
