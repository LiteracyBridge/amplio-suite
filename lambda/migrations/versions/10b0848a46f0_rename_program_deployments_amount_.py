"""Rename program.deployments_amount, content.deployment_id and content.program_code

Revision ID: 10b0848a46f0
Revises: 911b451e82a0
Create Date: 2020-09-16 14:24:31.162821

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '10b0848a46f0'
down_revision = '911b451e82a0'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('content', 'program_code', new_column_name='projectcode')
    op.alter_column('content', 'deployment_id', new_column_name='deployment')
    op.alter_column('programs', 'deployments_amount', new_column_name='deployments_count')

    op.drop_constraint('content_uniqueness_key', 'content', type_='unique')
    op.create_unique_constraint('content_uniqueness_key', 'content', ['projectcode', 'deployment'])

    op.drop_constraint('content_program_code_fkey', 'content', type_='foreignkey')
    op.create_foreign_key(
        'content_program_code_fkey', 'content', 'deployments',
        ['projectcode', 'deployment'],
        ['project', 'deployment']
    )


def downgrade():
    op.alter_column('content', 'projectcode', new_column_name='program_code')
    op.alter_column('content', 'deployment', new_column_name='deployment_id')
    op.alter_column('programs', 'deployments_count', new_column_name='deployments_amount')

    op.drop_constraint('content_uniqueness_key', 'content', type_='unique')
    op.create_unique_constraint('content_uniqueness_key', 'content', ['program_code', 'deployment_id'])

    op.drop_constraint('content_program_code_fkey', 'content', type_='foreignkey')
    op.create_foreign_key(
        'content_program_code_fkey', 'content', 'deployments',
        ['program_code', 'deployment_id'],
        ['project', 'deployment']
    )
