import pytest
from api.logic.coordinate_converter import convert_plane_to_azimuth_elevation



def test_conversion_success():
    azimuth,elevation = convert_plane_to_azimuth_elevation(48.85,2.35,48.85,2.35,10000)
    assert elevation == 90.0
    assert 0 <= azimuth <= 360



def test_conversion_invalid_data():
    with pytest.raises(ValueError):
        #Impossible plane_altitude
        convert_plane_to_azimuth_elevation(48.85,2.35,95.0,2.35,10000)


    with pytest.raises(ValueError):
        # Altitude missing (None)
        convert_plane_to_azimuth_elevation(48.85,2.35,48.85,2.35,None)

