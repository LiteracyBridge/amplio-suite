"""Add SupportedLanguages table

Revision ID: 0eb04d934e76
Revises: 8331cd65623e
Create Date: 2020-07-21 22:46:32.719686

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0eb04d934e76'
down_revision = '8331cd65623e'
branch_labels = None
depends_on = None


def upgrade():
    languages_table = op.create_table('supportedlanguages',
        sa.Column('languagecode', sa.String(), nullable=False),
        sa.Column('languagename', sa.String(), nullable=False),
        sa.Column('comments', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('languagecode')
    )

    # initialise some sample data
    op.bulk_insert(languages_table,
        [
            {'languagecode': 'eng', 'languagename': 'English'},
            {'languagecode': 'spa', 'languagename': 'Spanish'},
            {'languagecode': 'npi', 'languagename': 'Nepali'},
            {'languagecode': 'deu', 'languagename': 'German'},
            {'languagecode': 'ita', 'languagename': 'Italian'},
            {'languagecode': 'hin', 'languagename': 'Hindi'},
        ]
    )

def downgrade():
    op.drop_table('supportedlanguages')
