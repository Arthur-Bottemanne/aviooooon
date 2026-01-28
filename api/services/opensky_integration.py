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
    OPENSKY_INDEX = {
        "CALLSIGN": 1,
        "LONGITUDE": 5,
        "LATITUDE": 6,
        "BAROMETRIC_ALTITUDE": 7,
        "SPEED": 9,
        "HEADING": 10
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
                "callsign": state[OPENSKY_INDEX["CALLSIGN"]].strip() if state[OPENSKY_INDEX["CALLSIGN"]] else "UNKNOWN",
                "longitude": state[OPENSKY_INDEX["LONGITUDE"]],
                "latitude": state[OPENSKY_INDEX["LATITUDE"]],
                "altitude": state[OPENSKY_INDEX["BAROMETRIC_ALTITUDE"]],
                "speed": state[OPENSKY_INDEX["SPEED"]],
                "heading": state[OPENSKY_INDEX["HEADING"]],
            })
        return formatted_planes
    except requests.exceptions.HTTPError as http_err:
        print(f"API error: {http_err}")
    except Exception as err:
        print(f"Unexpected error: {err}")

    return []


