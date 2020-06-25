"""create program table

Revision ID: 039c39497278
Revises:
Create Date: 2020-05-19 16:37:13.881719

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '039c39497278'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'programs',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.String(50), nullable=False),

        sa.Column('listening_model', sa.JSON(), nullable=False),
        sa.Column('sustainable_development_goal', sa.JSON(), nullable=False),

        sa.Column('amount_deployment', sa.Integer, nullable=False),
        sa.Column('deployment_length', sa.String(50), nullable=False),
        sa.Column('first_deployment', sa.Date, nullable=False),

        sa.Column('feedback_frequency', sa.String(50), nullable=False),
        sa.Column('feedback_frequency2', sa.String(50), nullable=False),
    )
    op.create_index(op.f('ix_programs_id'), 'programs', ['id'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_programs_id'), table_name='programs')
    op.drop_table('programs')
