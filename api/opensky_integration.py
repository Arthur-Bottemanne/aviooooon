import requests
from bounding_box import get_bounding_box


def fetch_aircrafts(latitude, longitude,radius_km):
    bounds = get_bounding_box(latitude, longitude, radius_km)
    url = "https://opensky-network.org/api/states/all"

    try:
        response = requests.get(url,params=bounds,timeout=10)

        #Check whether the API returns an error
        response.raise_for_status()
        data = response.json()

        return data.get("states",[])
    except requests.exceptions.HTTPError as http_err:
        print(f"API error: {http_err}")
    except Exception as err:
        print(f"Unexpected error: {err}")

    return []


