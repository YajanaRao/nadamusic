"""init

Revision ID: 3258b60e537c
Revises: 87b2df0946c6
Create Date: 2020-04-09 20:45:43.085113

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3258b60e537c'
down_revision = '87b2df0946c6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('connection', sa.Column(
        'user_id', sa.Integer()))
    # op.alter_column('connection', 'refresh_token',
    #                 existing_type=sa.TEXT(),
    #                 nullable=False)
    # op.alter_column('connection', 'title',
    #                 existing_type=sa.TEXT(),
    #                 nullable=False)
    # op.alter_column('connection', 'token',
    #                 existing_type=sa.TEXT(),
    #                 nullable=False)
    # op.create_unique_constraint(
    #     op.f('uq_connection_refresh_token'), 'connection', ['refresh_token'])
    # op.create_unique_constraint(
    #     op.f('uq_connection_token'), 'connection', ['token'])
    # ### end Alembic commands ###
    pass


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(op.f('uq_connection_token'),
                       'connection', type_='unique')
    op.drop_constraint(op.f('uq_connection_refresh_token'),
                       'connection', type_='unique')
    op.alter_column('connection', 'token',
                    existing_type=sa.TEXT(),
                    nullable=True)
    op.alter_column('connection', 'title',
                    existing_type=sa.TEXT(),
                    nullable=True)
    op.alter_column('connection', 'refresh_token',
                    existing_type=sa.TEXT(),
                    nullable=True)
    op.drop_column('connection', 'user_id', nullable=True)
    # ### end Alembic commands ###
