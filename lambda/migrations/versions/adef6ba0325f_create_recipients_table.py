"""Create recipients table

Revision ID: adef6ba0325f
Revises: 2bab28cb10f5
Create Date: 2020-09-01 18:26:54.516331

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from models.utils.pgpoint import PGPoint

# revision identifiers, used by Alembic.
revision = 'adef6ba0325f'
down_revision = '2bab28cb10f5'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('recipients',
    sa.Column('recipientid', sa.String(), nullable=False),
    sa.Column('project', sa.String(), nullable=False),
    sa.Column('partner', sa.String(), nullable=False),
    sa.Column('communityname', sa.String(), nullable=False),
    sa.Column('groupname', sa.String(), nullable=False),
    sa.Column('affiliate', sa.String(), nullable=False),
    sa.Column('component', sa.String(), nullable=False),
    sa.Column('country', sa.String(), nullable=False),
    sa.Column('region', sa.String(), nullable=False),
    sa.Column('district', sa.String(), nullable=False),
    sa.Column('numhouseholds', sa.Integer(), nullable=False),
    sa.Column('numtbs', sa.Integer(), nullable=False),
    sa.Column('supportentity', sa.String(), nullable=False),
    sa.Column('model', sa.String(), nullable=False),
    sa.Column('language', sa.String(), nullable=False),
    sa.Column('coordinates', PGPoint(), nullable=True),
    sa.Column('agent', sa.String(), nullable=False),
    sa.Column('latitude', postgresql.DOUBLE_PRECISION(), nullable=True),
    sa.Column('longitude', postgresql.DOUBLE_PRECISION(), nullable=True),
    sa.Column('variant', sa.String(), nullable=True),
    sa.CheckConstraint('(((recipientid)::text = lower((recipientid)::text)))', name='lowercase_recipientid_check'),
    sa.PrimaryKeyConstraint('recipientid'),
    sa.UniqueConstraint('partner', 'project', 'communityname', 'groupname', 'agent', name='recipients_uniqueness_key')
    )

def downgrade():
    op.drop_table('recipients')
