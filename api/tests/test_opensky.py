import unittest
from unittest.mock import patch
from api.services.opensky_integration import get_bounding_box,fetch_aircrafts


class TestOpenSky(unittest.TestCase):

    #Scenario 1
    def test_bounding_box_logic(self):
        bounds = get_bounding_box(46.5,6.5,50)
        self.assertIn("lamin",bounds)
        self.assertAlmostEqual(bounds["lamin"],46.05,places=1)


    #Scenario 2
    @patch("opensky_integration.requests.get")
    def test_fetch_success(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {
            "states": [["4b1812", "SWR123", "CH", 1641000000]]
        }

        result = fetch_aircrafts(46.5,6.5,50)

        self.assertEqual(len(result),1)
        self.assertEqual(result[0][1],"SWR123")
        mock_get.assert_called_once()


    #Scenario 3
    @patch("opensky_integration.requests.get")
    def test_fetch_failure(self, mock_get):
        mock_get.return_value.status_code = 500
        mock_get.return_value.raise_for_status.side_effect = Exception("Error 500")

        result = fetch_aircrafts(46.5,6.5,50)

        self.assertEqual(result,[])