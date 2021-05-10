"""Add id to deployemnts model

Revision ID: a54715f6d6bd
Revises: c9001a5fd214
Create Date: 2021-05-10 14:38:35.632972

"""
from alembic import op
import sqlalchemy as sa

from playlists.models import Playlist
from deployments.models import Deployment

# revision identifiers, used by Alembic.
revision = 'a54715f6d6bd'
down_revision = 'c9001a5fd214'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    session = sa.orm.Session(bind=bind)

    op.execute('''
ALTER TABLE deployments DROP CONSTRAINT deployments_pkey CASCADE;
ALTER TABLE deployments ADD COLUMN id SERIAL PRIMARY KEY;
''')
    # op.add_column('deployments', sa.Column('id', sa.Integer(), nullable=True))
    op.alter_column('deployments', 'deployment',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)
    op.alter_column('deployments', 'deploymentname',
               existing_type=sa.VARCHAR(length=255),
               nullable=False)

    for playlist in session.query(Playlist).all():
        deployment = session.query(Deployment) \
            .filter(
                Deployment.program_code == playlist.program_code,
                Deployment.number == playlist.deployment_id,
            ) \
            .first()
        playlist.deployment_id = deployment.id

    session.commit()

    op.drop_index('ix_deployments_deploymentnumber', table_name='deployments')
    op.create_foreign_key('playlist_deployment_fkey', 'playlists', 'deployments', ['deployment_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('playlist_program_code_fkey', 'playlists', 'projects', ['program_code'], ['projectcode'])


def downgrade():
    op.drop_constraint('playlist_deployment_fkey', 'playlists', type_='foreignkey')
    op.create_foreign_key('playlist_program_code_fkey', 'playlists', 'deployments', ['program_code', 'deployment_id'], ['project', 'deploymentnumber'], ondelete='CASCADE')
    op.create_index('ix_deployments_deploymentnumber', 'deployments', ['deploymentnumber'], unique=False)
    op.alter_column('deployments', 'deploymentname',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.alter_column('deployments', 'deployment',
               existing_type=sa.VARCHAR(length=255),
               nullable=True)
    op.drop_column('deployments', 'id')
