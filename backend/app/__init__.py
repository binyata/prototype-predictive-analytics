import os

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()


def create_app(config_object="app.config.Config"):
    app = Flask(__name__)
    CORS(app)

    # LOAD CONFIG FIRST
    app.config.from_object(config_object)

    if not app.config.get("SQLALCHEMY_DATABASE_URI"):
        app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")

    db.init_app(app)
    migrate.init_app(app, db)

    from .routes import county_route, index_route

    app.register_blueprint(index_route)
    app.register_blueprint(county_route)

    from . import models  # noqa: F401 so migrations see models

    return app
