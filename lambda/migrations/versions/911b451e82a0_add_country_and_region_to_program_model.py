"""Add country and region to program model

Revision ID: 911b451e82a0
Revises: 2bab28cb10f5
Create Date: 2020-09-21 19:32:31.362096

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '911b451e82a0'
down_revision = '2bab28cb10f5'
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
