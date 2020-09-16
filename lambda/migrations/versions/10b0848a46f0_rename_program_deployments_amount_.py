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
    op.add_column('content', sa.Column('deployment', sa.String(length=255), nullable=False))
    op.add_column('content', sa.Column('projectcode', sa.String(length=255), nullable=False))

    op.drop_constraint('content_uniqueness_key', 'content', type_='unique')
    op.create_unique_constraint('content_uniqueness_key', 'content', ['projectcode', 'deployment'])

    op.drop_constraint('content_program_code_fkey', 'content', type_='foreignkey')
    op.create_foreign_key(
        'content_program_code_fkey', 'content', 'deployments',
        ['projectcode', 'deployment'],
        ['project', 'deployment']
    )

    op.drop_column('content', 'program_code')
    op.drop_column('content', 'deployment_id')

    op.add_column('programs', sa.Column('deployments_count', sa.Integer(), nullable=False))
    op.drop_column('programs', 'deployments_amount')


def downgrade():
    op.add_column('programs', sa.Column('deployments_amount', sa.INTEGER(), autoincrement=False, nullable=False))
    op.drop_column('programs', 'deployments_count')

    op.add_column('content', sa.Column('deployment_id', sa.VARCHAR(length=255), autoincrement=False, nullable=False))
    op.add_column('content', sa.Column('program_code', sa.VARCHAR(length=255), autoincrement=False, nullable=False))

    op.drop_constraint('content_uniqueness_key', 'content', type_='unique')
    op.create_unique_constraint('content_uniqueness_key', 'content', ['program_code', 'deployment_id'])

    op.drop_constraint('content_program_code_fkey', 'content', type_='foreignkey')
    op.create_foreign_key(
        'content_program_code_fkey', 'content', 'deployments',
        ['program_code', 'deployment_id'],
        ['project', 'deployment']
    )

    op.drop_column('content', 'projectcode')
    op.drop_column('content', 'deployment')
