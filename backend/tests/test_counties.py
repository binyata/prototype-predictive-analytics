import json

from app import db
from app.models import County


def test_get_counties_using_direct_seeding(client, app):
    with app.app_context():
        db.session.add(County(name="Test County", value=123))
        db.session.commit()

    response = client.get("/counties")
    data = response.get_json()
    assert response.status_code == 200
    assert data[0]["id"] == 1
    assert data[0]["name"] == "Test County"
    assert data[0]["value"] == 123


def test_get_counties_using_mocked_model(client, monkeypatch):
    def fake_get_all():
        return [type("X", (), {"id": 1, "name": "Fake", "value": 99})()]

    monkeypatch.setattr("app.models.County.get_all", fake_get_all)

    response = client.get("/counties")
    assert response.status_code == 200

    assert response.get_json() == [{"id": 1, "name": "Fake", "value": 99}]


def test_get_counties_returns_sorted_list_and_no_delay(client, app, monkeypatch):
    with app.app_context():
        db.session.add(County(name="Zeta", value=5))
        db.session.add(County(name="Alpha", value=1))
        db.session.commit()

    monkeypatch.setattr("app.routes.time.sleep", lambda _seconds: None)

    response = client.get("/counties")
    assert response.status_code == 200
    data = response.get_json()
    assert [c["name"] for c in data] == ["Alpha", "Zeta"]


def test_bulk_update_counties_success(client, app):
    with app.app_context():
        county = County(name="UpdateMe", value=1)
        db.session.add(county)
        db.session.commit()
        county_id = county.id

    payload = [{"id": county_id, "value": 10}]
    response = client.put("/counties", data=json.dumps(payload), content_type="application/json")
    assert response.status_code == 200
    assert response.get_json() == payload

    with app.app_context():
        updated = County.get_by_id(county_id)
        assert updated.value == 10


def test_bulk_update_missing_county_returns_404(client):
    payload = [{"id": 999, "value": 7}]
    response = client.put("/counties", data=json.dumps(payload), content_type="application/json")

    assert response.status_code == 404
    assert response.get_json() == {"error": "County not found"}
