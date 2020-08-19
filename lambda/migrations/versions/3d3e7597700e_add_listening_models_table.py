"""add listening models table

Revision ID: 3d3e7597700e
Revises: 58b4f4bb9b23
Create Date: 2020-08-18 14:18:40.839963

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3d3e7597700e'
down_revision = '58b4f4bb9b23'
branch_labels = None
depends_on = None


def upgrade():
    listening_models = op.create_table('listening_models',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('label', sa.String(length=250), nullable=False),
        sa.Column('img_url', sa.String(length=250), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    op.bulk_insert(listening_models, [
        { 'id': 1, 'label': 'Households', 'img_url': 'https://amplio-suite.s3-us-west-2.amazonaws.com/img/listening/Households.png' },
        { 'id': 2, 'label': 'Groups', 'img_url': 'https://amplio-suite.s3-us-west-2.amazonaws.com/img/listening/Groups.png' },
        { 'id': 3, 'label': 'Community Workers', 'img_url': 'https://amplio-suite.s3-us-west-2.amazonaws.com/img/listening/Community Workers.png' },
        { 'id': 4, 'label': 'Place-based', 'img_url': 'https://amplio-suite.s3-us-west-2.amazonaws.com/img/listening/Place-based.png' },
        { 'id': 5, 'label': 'Other', 'img_url': 'https://amplio-suite.s3-us-west-2.amazonaws.com/img/listening/Place-based.png' },
    ])


def downgrade():
    op.drop_table('listening_models')
