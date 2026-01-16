from fastapi import FastAPI
from typing import Optional
from datetime import datetime
from moon import  compute_moon_position
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Moon & Aircraft Predictor",
    description="Prediction of aircraft passing in front of the moon ",
    version="1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Your Vite URL
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



