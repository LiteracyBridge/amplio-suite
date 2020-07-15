"""Drop non-existent projects index

Revision ID: 17d76120cf68
Revises: 37be23fd2712
Create Date: 2020-07-15 20:05:00.281446

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '17d76120cf68'
down_revision = '37be23fd2712'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_index(op.f('ix_projects_projectcode'), table_name='projects')

def downgrade():
    op.create_index(op.f('ix_projects_projectcode'), 'projects', ['projectcode'], unique=False)
