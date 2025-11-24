"""seed utah counties

Revision ID: 6917763af1b8
Revises: 9385000d78f5
Create Date: 2025-11-22 11:44:05.306491

"""

from alembic import op

# revision identifiers, used by Alembic.
revision = "6917763af1b8"
down_revision = "9385000d78f5"
branch_labels = None
depends_on = None


def upgrade():
    counties = [
        "Beaver",
        "Box Elder",
        "Cache",
        "Carbon",
        "Daggett",
        "Davis",
        "Duchesne",
        "Emery",
        "Garfield",
        "Grand",
        "Iron",
        "Juab",
        "Kane",
        "Millard",
        "Morgan",
        "Piute",
        "Rich",
        "Salt Lake",
        "San Juan",
        "Sanpete",
        "Sevier",
        "Summit",
        "Tooele",
        "Uintah",
        "Utah",
        "Wasatch",
        "Washington",
        "Wayne",
        "Weber",
    ]

    for name in counties:
        op.execute(f"INSERT INTO counties (name, value) VALUES ('{name}', 0);")


def downgrade():
    op.execute("DELETE FROM counties;")
