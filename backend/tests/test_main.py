import sys
from pathlib import Path

from fastapi.testclient import TestClient

# Make the backend folder importable
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from main import app

client = TestClient(app)


def test_home():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "POLAR AI Backend is running"


def test_get_icebergs():
    response = client.get("/icebergs")
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_unknown_iceberg():
    response = client.get("/predict/UNKNOWN")
    assert response.status_code == 404
    assert response.json()["detail"] == "Iceberg not found"


def test_valid_iceberg():
    response = client.get("/predict/A76C")
    assert response.status_code == 200
    assert response.json()["id"] == "A76C"

    
def test_stats():
    response = client.get("/stats")

    assert response.status_code == 200

    data = response.json()
    assert "total_icebergs" in data
    assert "latest_observation" in data
    assert data["total_icebergs"] == 38


def test_risk():
    response = client.get("/risk/")

    assert response.status_code == 200
    assert isinstance(response.json(), dict)
