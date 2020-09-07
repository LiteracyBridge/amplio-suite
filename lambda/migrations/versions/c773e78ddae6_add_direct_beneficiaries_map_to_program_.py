"""add direct beneficiaries map to program model

Revision ID: c773e78ddae6
Revises: adef6ba0325f
Create Date: 2020-09-04 15:03:50.428949

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c773e78ddae6'
down_revision = 'adef6ba0325f'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('programs', sa.Column('direct_beneficiaries_map', sa.JSON(), nullable=True))
    op.add_column('programs', sa.Column('direct_beneficiaries_additional_map', sa.JSON(), nullable=True))

    beneficiaries_map = """{households, "Number of Households", male, "Number Male", female, "Number Female", youth, "Number Youth"}"""

    op.execute(f"""
        UPDATE programs
        SET direct_beneficiaries_map = json_object('{beneficiaries_map}')
    """)
    op.execute("UPDATE programs SET direct_beneficiaries_additional_map = json_object('{}')")

def downgrade():
    op.drop_column('programs', 'direct_beneficiaries_additional_map')
    op.drop_column('programs', 'direct_beneficiaries_map')
