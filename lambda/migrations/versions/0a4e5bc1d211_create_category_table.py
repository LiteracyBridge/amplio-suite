"""Create category table

Revision ID: 0a4e5bc1d211
Revises: 8331cd65623e
Create Date: 2020-08-03 12:04:32.025690

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0a4e5bc1d211'
down_revision = '8331cd65623e'
branch_labels = None
depends_on = None


def upgrade():
    categories_table = op.create_table('supportedcategories',
        sa.Column('categorycode', sa.String(), nullable=False),
        sa.Column('parentcategory', sa.String(), nullable=True),
        sa.Column('isleafnode', sa.Boolean(), nullable=False),
        sa.Column('categoryname', sa.String(), nullable=False),
        sa.Column('fullname', sa.String(), nullable=False),
        sa.ForeignKeyConstraint(['parentcategory'], ['supportedcategories.categorycode'], ),
        sa.PrimaryKeyConstraint('categorycode')
    )

    # initialise some sample data
    op.bulk_insert(categories_table, [
        {'categorycode': '1', 'parentcategory': None, 'isleafnode': True, 'categoryname': 'Agriculture', 'fullname': 'Agriculture'},
        {'categorycode': '1-0', 'parentcategory': '1', 'isleafnode': False, 'categoryname': 'General Agriculture', 'fullname': 'Agriculture:General Agriculture'},
        {'categorycode': '1-1', 'parentcategory': '1', 'isleafnode': True, 'categoryname': 'Crops', 'fullname': 'Agriculture:Crops'},
        {'categorycode': '1-1-0', 'parentcategory': '1-1', 'isleafnode': False, 'categoryname': 'General Crops', 'fullname': 'Agriculture:Crops:General Crops'},
        {'categorycode': '1-1-1', 'parentcategory': '1-1', 'isleafnode': False, 'categoryname': 'Maize', 'fullname': 'Agriculture:Crops:Maize'},
        {'categorycode': '1-1-2', 'parentcategory': '1-1', 'isleafnode': False, 'categoryname': 'Millet', 'fullname': 'Agriculture:Crops:Millet'},
        {'categorycode': '1-3', 'parentcategory': '1', 'isleafnode': True, 'categoryname': 'Agric Process', 'fullname': 'Agriculture:Agric Process'},
        {'categorycode': '1-3-0', 'parentcategory': '1-3', 'isleafnode': False, 'categoryname': 'General Agric Process', 'fullname': 'Agriculture:Agric Process:General Agric Process'},
        {'categorycode': '1-3-1', 'parentcategory': '1-3', 'isleafnode': False, 'categoryname': 'Preparing land for the growing season', 'fullname': 'Agriculture:Agric Process:Preparing land for the growing season'},
        {'categorycode': '2', 'parentcategory': None, 'isleafnode': True, 'categoryname': 'Health', 'fullname': 'Health'},
        {'categorycode': '2-0', 'parentcategory': '2', 'isleafnode': False, 'categoryname': 'General Health', 'fullname': 'Health:General Health'},
        {'categorycode': '2-1', 'parentcategory': '2', 'isleafnode': False, 'categoryname': 'HIV/Aids', 'fullname': 'Health:HIV/Aids'},
        {'categorycode': '2-2', 'parentcategory': '2', 'isleafnode': False, 'categoryname': 'LLINs and Malaria', 'fullname': 'Health:LLINs and Malaria'},
        {'categorycode': '3', 'parentcategory': None, 'isleafnode': True, 'categoryname': 'Education', 'fullname': 'Education'},
        {'categorycode': '3-0', 'parentcategory': '3', 'isleafnode': False, 'categoryname': 'General Education', 'fullname': 'Education:General Education'},
        {'categorycode': '3-1', 'parentcategory': '3', 'isleafnode': False, 'categoryname': 'Adult Literacy', 'fullname': 'Education:Adult Literacy'},
        {'categorycode': '3-2', 'parentcategory': '3', 'isleafnode': False, 'categoryname': 'School Lessons', 'fullname': 'Education:School Lessons'},
        {'categorycode': '3-10', 'parentcategory': '3', 'isleafnode': False, 'categoryname': 'Kindergarten Enrollment', 'fullname': 'Education:Kindergarten Enrollment'},
    ])


def downgrade():
    op.drop_table('supportedcategories')
