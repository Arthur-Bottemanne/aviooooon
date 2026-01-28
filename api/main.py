import os
from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime
from logic.coordinate_converter import convert_plane_to_azimuth_elevation
from services.moon import  compute_moon_position
from services.opensky_integration import fetch_aircrafts

app = FastAPI(
    title="Moon & Aircraft Predictor",
    description="Prediction of aircraft passing in front of the moon ",
    version="1.0",
)

load_dotenv()
frontend_url = os.getenv("FRONTEND_URL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/moon")
async def get_moon_position(latitude: float, longitude: float,date:Optional[str]=None):
    if date:
        try:
            search_date = datetime.fromisoformat(date)
        except ValueError:
            return {"error": "Invalid date format. Use YYYY-MM-DDTHH:MM:SS"}
    else:
        search_date = datetime.now()
    result = compute_moon_position(latitude, longitude, search_date)

    return {
        "status": "success",
        "timestamp": search_date.isoformat(),
        "location": {"latitude": latitude, "longitude": longitude},
        "data": result
    }


@app.get("/aircrafts")
async def get_aircrafts(latitude: float, longitude: float,radius: int = 100,time:Optional[int]= Query(None,description="Timestamp in UNIX format (e.g., 1704067200)")):
    try:
        planes = fetch_aircrafts(latitude, longitude, radius,time_stamp=time)

        results = []
        for plane in planes:
            try:

                plane_latitude = plane.get("latitude")
                plane_longitude = plane.get("longitude")
                plane_altitude = plane.get("altitude")

                if None in (plane_latitude,plane_longitude,plane_altitude):
                    continue

                azimuth,elevation = convert_plane_to_azimuth_elevation(latitude,longitude,plane_latitude,plane_longitude,plane_altitude)

                results.append({
                    "callsign": plane.get("callsign"),
                    "azimuth": round(azimuth,2),
                    "elevation": round(elevation,2)
                })
            except Exception:
                continue
        return {
            "status": "success",
            "latitude": latitude,
            "longitude": longitude,
            "radius_km": radius,
            "requested_time": time,
            "count": len(results),
            "data": results
        }

    except Exception as e:
       return JSONResponse(status_code=500,content={"status": "failed","message": f"Internal Server Error: {str(e)}"})