"""Update Programs table

Revision ID: 8331cd65623e
Revises: 17d76120cf68
Create Date: 2020-07-15 23:38:26.182654

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '8331cd65623e'
down_revision = '17d76120cf68'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('programs', 'amount_deployment', new_column_name='deployments_amount')
    op.alter_column('programs', 'first_deployment', new_column_name='deployments_first')
    op.alter_column('programs', 'deployment_length', new_column_name='deployments_length')
    op.alter_column('programs', 'feedback_frequency2', new_column_name='feedback_frequency_other')
    op.alter_column('programs', 'listening_model', new_column_name='listening_models')
    op.alter_column('programs', 'project', new_column_name='projectcode')
    op.alter_column('programs', 'sustainable_development_goal', new_column_name='sustainable_development_goals')
    
    op.add_column('programs', sa.Column('languages', sa.JSON(), nullable=False))

    op.drop_column('programs', 'name')

    op.create_foreign_key('programs_projectcode_fkey', 'programs', 'projects', ['projectcode'], ['projectcode'])


def downgrade():
    op.alter_column('programs', 'deployments_amount', new_column_name='amount_deployment')
    op.alter_column('programs', 'deployments_first', new_column_name='first_deployment')
    op.alter_column('programs', 'deployments_length', new_column_name='deployment_length')
    op.alter_column('programs', 'feedback_frequency_other', new_column_name='feedback_frequency2')
    op.alter_column('programs', 'listening_models', new_column_name='listening_model')
    op.alter_column('programs', 'projectcode', new_column_name='project')
    op.alter_column('programs', 'sustainable_development_goals', new_column_name='sustainable_development_goal')

    op.drop_column('programs', 'languages')

    op.add_column('programs', sa.Column('name', sa.VARCHAR(length=50), autoincrement=False, nullable=True))
    op.execute("UPDATE programs SET name = ''")
    op.alter_column('programs', 'name', nullable=False)

    op.drop_constraint('programs_projectcode_fkey', 'programs', type_='foreignkey')
