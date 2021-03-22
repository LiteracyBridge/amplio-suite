"""Fix DB

Revision ID: c9001a5fd214
Revises: d41294df6dc7
Create Date: 2021-03-22 14:10:47.591081

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c9001a5fd214'
down_revision = 'd41294df6dc7'
branch_labels = None
depends_on = None


def upgrade():
    op.create_index(
        op.f('ix_projects_projectcode'),
        'projects',
        ['projectcode'],
        unique=False,
    )
    op.create_index(
        op.f('ix_programs_projectcode'),
        'programs',
        ['projectcode'],
        unique=False,
    )

    # Deployments table
    op.alter_column(
        'deployments',
        'deploymentnumber',
        autoincrement=True,
        nullable=False,
    )
    op.alter_column(
        'deployments',
        'project',
        nullable=False,
    )
    op.alter_column(
        'deployments',
        'deployment',
        existing_type=sa.VARCHAR(length=255),
        nullable=True,
    )
    op.create_primary_key(
        'deployments_pkey',
        'deployments',
        ['deploymentnumber', 'project'],
    )
    op.create_index(
        op.f('ix_deployments_project'),
        'deployments',
        ['project'],
        unique=False
    )
    op.create_index(
        op.f('ix_deployments_deploymentnumber'),
        'deployments',
        ['deploymentnumber'],
        unique=False,
    )
    op.create_foreign_key(
        'deployment_program_code_fkey',
        'deployments',
        'projects',
        ['project'],
        ['projectcode'],
    )
    op.execute(
        'ALTER TABLE deployments '
        'DROP CONSTRAINT deployments_uniqueness_key CASCADE'
    )
    op.create_unique_constraint(
        'deployments_uniqueness_key',
        'deployments',
        ['project', 'deploymentnumber'],
    )

    # Playlsits table
    op.execute(
        'ALTER TABLE playlists '
        'ALTER COLUMN deployment_id TYPE INT '
        'USING deployment_id::integer'
    )
    op.create_unique_constraint(
        'playlist_title_uniqueness_key',
        'playlists',
        ['program_code', 'deployment_id', 'title'],
    )
    op.create_foreign_key(
        'playlist_program_code_fkey',
        'playlists',
        'deployments',
        ['program_code', 'deployment_id'],
        ['project', 'deploymentnumber'],
        ondelete='CASCADE',
    )

    # Messages table
    op.alter_column(
        'messages',
        'id',
        nullable=False,
    )
    op.execute(
        'ALTER TABLE messages '
        'DROP CONSTRAINT messages_pkey CASCADE'
    )
    op.create_primary_key(
        'messages_pkey',
        'messages',
        ['id', 'program_code'],
    )
    op.create_unique_constraint(
        'message_title_uniqueness_key',
        'messages',
        ['program_code', 'playlist_id', 'title'],
    )
    op.alter_column(
        'messages',
        'key_point',
        new_column_name='key_points',
    )


    # Recipients table
    op.alter_column(
        'recipients',
        'recipientid',
        autoincrement=True,
        nullable=False,
    )
    op.alter_column(
        'recipients',
        'project',
        nullable=False,
    )
    op.execute(
        'ALTER TABLE recipients '
        'DROP CONSTRAINT recipients_pkey CASCADE'
    )
    op.create_primary_key(
        'recipients_pkey',
        'recipients',
        ['recipientid', 'project'],
    )
    op.create_index(
        op.f('ix_recipients_project'),
        'recipients',
        ['project'],
        unique=False,
    )
    op.create_index(
        op.f('ix_recipients_recipientid'),
        'recipients',
        ['recipientid'],
        unique=False,
    )
    op.create_foreign_key(
        'deployment_program_code_fkey',
        'recipients',
        'projects',
        ['project'],
        ['projectcode'],
    )
    op.alter_column(
        'recipients',
        'model',
        new_column_name='listening_model',
    )

    #
    op.alter_column(
        'sustainable_development_targets',
        'goal_id',
        existing_type=sa.INTEGER(),
        nullable=True,
    )


def downgrade():
    op.alter_column(
        'sustainable_development_targets',
        'goal_id',
        existing_type=sa.INTEGER(),
        nullable=False,
    )

    op.alter_column(
        'recipients',
        'listening_model',
        new_column_name='model',
    )
    op.drop_constraint(
        'deployment_program_code_fkey', 'recipients', type_='foreignkey'
    )
    op.drop_index(
        op.f('ix_recipients_recipientid'), table_name='recipients'
    )
    op.drop_index(
        op.f('ix_recipients_project'), table_name='recipients'
    )
    op.execute(
        'ALTER TABLE recipients '
        'DROP CONSTRAINT recipients_pkey CASCADE'
    )
    op.create_primary_key(
        'recipients_pkey',
        'recipients',
        ['recipientid'],
    )
    op.alter_column(
        'recipients',
        'project',
        nullable=True,
    )
    op.alter_column(
        'recipients',
        'recipientid',
        autoincrement=False,
        nullable=True,
    )

    op.alter_column(
        'messages',
        'key_points',
        new_column_name='key_point',
    )
    op.drop_constraint(
        'message_title_uniqueness_key', 'messages', type_='unique'
    )
    op.execute(
        'ALTER TABLE messages '
        'DROP CONSTRAINT messages_pkey CASCADE'
    )
    op.create_primary_key(
        'messages_pkey',
        'messages',
        ['id'],
    )
    op.alter_column(
        'messages',
        'id',
        nullable=True,
    )

    op.drop_constraint(
        'playlist_program_code_fkey',
        'playlists',
        type_='foreignkey'
    )
    op.drop_constraint(
        'playlist_title_uniqueness_key', 'playlists', type_='unique'
    )
    op.execute(
        'ALTER TABLE playlists '
        'ALTER COLUMN deployment_id TYPE VARCHAR '
        'USING deployment_id::text'
    )

    op.alter_column(
        'deployments',
        'deployment',
        existing_type=sa.VARCHAR(length=255),
        nullable=False,
    )
    op.drop_constraint(
        'deployment_program_code_fkey',
        'deployments',
        type_='foreignkey'
    )
    op.execute(
        'ALTER TABLE deployments '
        'DROP CONSTRAINT deployments_uniqueness_key CASCADE')
    op.create_unique_constraint(
        'deployments_uniqueness_key',
        'deployments',
        ['project', 'deployment'],
    )
    op.drop_constraint(
        'deployments_pkey', 'deployments', type_='primary'
    )
    op.drop_constraint(
        'deployment_program_code_fkey', 'deployments', type_='foreignkey'
    )
    op.drop_index(
        op.f('ix_deployments_deploymentnumber'), table_name='deployments'
    )
    op.drop_index(
        op.f('ix_deployments_project'), table_name='deployments'
    )
    op.alter_column(
        'deployments',
        'project',
        nullable=True,
    )
    op.alter_column(
        'deployments',
        'deploymentnumber',
        autoincrement=False,
        nullable=True,
    )

    op.drop_index(op.f('ix_programs_projectcode'), table_name='programs')
    op.drop_index(op.f('ix_projects_projectcode'), table_name='projects')
