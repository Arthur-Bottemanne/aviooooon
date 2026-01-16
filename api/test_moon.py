import pytest
from datetime import datetime
from moon import compute_moon_position



def test_standard_calculation():
    latitude = 46.5
    longitude = 6.5
    date_utc = datetime(2026, 1, 15, 22, 0, 0)

    result = compute_moon_position(latitude, longitude, date_utc)

    assert "azimuth" in result
    assert "elevation" in result
    assert "phase" in result


    assert  0 <= result["azimuth"] <= 360
    assert -90 <= result["elevation"] <= 90
    assert 0.0 <= result["phase"] <= 1.0

