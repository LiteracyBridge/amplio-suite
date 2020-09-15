"""add partner and affiliate to program model

Revision ID: 5dd49c12691e
Revises: c773e78ddae6
Create Date: 2020-09-14 15:37:21.054358

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5dd49c12691e'
down_revision = 'c773e78ddae6'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('programs', sa.Column('affiliate', sa.String(), nullable=False))
    op.add_column('programs', sa.Column('partner', sa.String(), nullable=False))


def downgrade():
    op.drop_column('programs', 'partner')
    op.drop_column('programs', 'affiliate')
