import requests
from logic.bounding_box import get_bounding_box


def fetch_aircrafts(latitude, longitude,radius_km,time_stamp=None):
    bounds = get_bounding_box(latitude, longitude, radius_km)
    url = "https://opensky-network.org/api/states/all"
    parameters = {
        "lamin": bounds["lamin"],
        "lomin": bounds["lomin"],
        "lamax": bounds["lamax"],
        "lomax": bounds["lomax"]
    }
    if time_stamp:
        parameters["time"] = time_stamp
    try:
        response = requests.get(url,params=parameters,timeout=10)

        #Check whether the API returns an error
        response.raise_for_status()
        data = response.json()
        states = data.get("states",[])

        formatted_planes = []
        for state in states:
            formatted_planes.append({
                "callsign": state[1].strip() if state[1] else "UNKNOWN",
                "longitude": state[5],
                "latitude": state[6],
                "altitude": state[7],
            })
        return formatted_planes
    except requests.exceptions.HTTPError as http_err:
        print(f"API error: {http_err}")
    except Exception as err:
        print(f"Unexpected error: {err}")

    return []


