"""add country and region to program model

Revision ID: 54aafb39c680
Revises: c0b39e045fba
Create Date: 2020-08-25 20:39:42.161232

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '54aafb39c680'
down_revision = 'c0b39e045fba'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('programs', sa.Column('country', sa.String(length=50), nullable=True))
    op.add_column('programs', sa.Column('region', sa.JSON(), nullable=True))

    op.execute("UPDATE programs SET country = '' ")
    op.execute("UPDATE programs SET region = '[]'")

    op.alter_column('programs', 'country', nullable=False)
    op.alter_column('programs', 'region', nullable=False)


def downgrade():
    op.drop_column('programs', 'region')
    op.drop_column('programs', 'country')
