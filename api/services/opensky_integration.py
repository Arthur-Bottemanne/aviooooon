import os
import requests
from dotenv import load_dotenv
from logic.bounding_box import get_bounding_box

load_dotenv()

OPENSKY_INDEX = {
    "CALLSIGN": 1,
    "LONGITUDE": 5,
    "LATITUDE": 6,
    "BAROMETRIC_ALTITUDE": 7,
    "VELOCITY": 9,
    "HEADING": 10,
    "VERTICAL_RATE": 11,
}

def get_opensky_token():
    auth_url = "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token"
    client_id = os.getenv("OPENSKY_CLIENT_ID")
    client_secret = os.getenv("OPENSKY_TOKEN")

    if not client_id or not client_secret:
        return None

    data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
    }

    try:
        response = requests.post(auth_url, data=data, timeout=10)
        response.raise_for_status()
        return response.json().get("access_token")
    except Exception as e:
        print(f"Failed to authenticate: {e}")
        return None

def fetch_aircrafts(latitude, longitude, radius_km, time_stamp=None):
    bounds = get_bounding_box(latitude, longitude, radius_km)
    url = "https://opensky-network.org/api/states/all"
    
    parameters = {
        "lamin": bounds["lamin"],
        "lomin": bounds["lomin"],
        "lamax": bounds["lamax"],
        "lomax": bounds["lomax"]
    }

    token = get_opensky_token()
    print(token)
    headers = {"Authorization": f"Bearer {token}"} if token else {}

    if time_stamp:
        parameters["time"] = time_stamp
    
    try:
        response = requests.get(url, params=parameters, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        states = data.get("states")
        
        if not states:
            return []

        formatted_planes = []
        for state in states:
            formatted_planes.append({
                "callsign": state[OPENSKY_INDEX["CALLSIGN"]].strip() if state[OPENSKY_INDEX["CALLSIGN"]] else "UNKNOWN",
                "longitude": state[OPENSKY_INDEX["LONGITUDE"]],
                "latitude": state[OPENSKY_INDEX["LATITUDE"]],
                "altitude": state[OPENSKY_INDEX["BAROMETRIC_ALTITUDE"]],
                "velocity": state[OPENSKY_INDEX["VELOCITY"]] or 0,
                "heading": state[OPENSKY_INDEX["HEADING"]] or 0,
                "vertical_rate": state[OPENSKY_INDEX["VERTICAL_RATE"]] or 0
            })
        return formatted_planes

    except requests.exceptions.HTTPError as http_err:
        print(f"API error: {http_err}")
    except Exception as err:
        print(f"Unexpected error: {err}")

    return []