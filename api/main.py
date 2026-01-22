from fastapi import FastAPI, HTTPException
from typing import Optional
from datetime import datetime
from moon import  compute_moon_position
from opensky_integration import fetch_aircrafts


app = FastAPI(
    title="Moon & Aircraft Predictor",
    description="Prediction of aircraft passing in front of the moon ",
    version="1.0",
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
async def get_aircrafts(latitude: float, longitude: float,radius: int = 100):
    try:
        planes = fetch_aircrafts(latitude, longitude, radius)

        return {
            "status": "success",
            "latitude": latitude,
            "longitude": longitude,
            "radius_km": radius,
            "count": len(planes),
            "data": planes
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")