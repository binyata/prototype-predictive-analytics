def test_health_check(client):
    response = client.get("/")
    assert response.status_code == 200
    assert b"alive" in response.data
