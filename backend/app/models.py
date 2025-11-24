from . import db


class County(db.Model):
    __tablename__ = "counties"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    value = db.Column(db.Integer, nullable=False, default=0)

    @classmethod
    def get_all(cls):
        return cls.query.order_by(cls.name).all()

    @classmethod
    def get_by_id(cls, county_id: int):
        return db.session.get(cls, county_id)

    @classmethod
    def get_by_name(cls, name: str):
        return cls.query.filter_by(name=name).first()

    def update(self, *, id: int | None = None, value: int | None = None):
        if id is not None:
            self.id = id
        if value is not None and id is not None:
            self.value = value
        db.session.commit()
        return self

    def delete(self, *, name: str | None = None):
        if name is not None:
            self.value = 0
        db.session.commit()
        return self

    def to_dict(self) -> dict:
        return {"id": self.id, "name": self.name, "value": self.value}

    def __repr__(self):
        return f"<County {self.name}: {self.value}>"
