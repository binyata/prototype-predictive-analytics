import time

from flask import Blueprint, g, jsonify, request

from .models import County

index_route = Blueprint("main", __name__)
county_route = Blueprint("counties", __name__, url_prefix="/counties")


@index_route.get("/")
def index():
    try:
        return jsonify({"message": "I am alive!"})
    except Exception as exc:
        print(f"Failed to serve index route: {exc}")
        return jsonify({"error": "Internal server error"}), 500


@county_route.get("", strict_slashes=False)
def get_counties():
    try:
        counties = County.get_all()
        return jsonify([{"id": c.id, "name": c.name, "value": c.value} for c in counties])
    except Exception as exc:
        print(f"Failed to fetch counties: {exc}")
        return jsonify({"error": "Failed to fetch counties"}), 500


@county_route.put("", strict_slashes=False)
def bulk_update_counties():
    try:
        data = request.get_json()
        print(data)
        for dat in data:
            county = County.get_by_id(dat["id"])
            if county is None:
                return jsonify({"error": "County not found"}), 404

            county.update(id=dat["id"], value=dat["value"])
        return jsonify(data), 200
    except Exception as exc:
        print(f"Failed to bulk update counties: {exc}")
        return jsonify({"error": "Failed to update counties"}), 500


@index_route.before_app_request
def before_request():
    g.request_start_time = time.time()


@index_route.after_app_request
def after_request(response):
    start = getattr(g, "request_start_time", None)
    if start is not None:
        duration = time.time() - start
        response.headers["X-Process-Time"] = f"{duration:.3f}s"
    return response
