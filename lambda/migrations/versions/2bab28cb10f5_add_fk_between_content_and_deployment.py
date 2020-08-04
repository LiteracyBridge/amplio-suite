"""add FK between content and deployment

Revision ID: 2bab28cb10f5
Revises: 0eb04d934e76
Create Date: 2020-08-03 20:46:10.323437

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2bab28cb10f5'
down_revision = '0eb04d934e76'
branch_labels = None
depends_on = None


def upgrade():
    op.create_foreign_key('content_program_code_fkey', 'content', 'deployments', ['program_code', 'deployment_id'], ['project', 'deployment'])


def downgrade():
    op.drop_constraint('content_program_code_fkey', 'content', type_='foreignkey')
