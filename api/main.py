from fastapi import FastAPI
from datetime import datetime
from moon import  compute_moon_position


app = FastAPI(
    title="Moon & Aircraft Predictor",
    description="Prediction of aircraft passing in front of the moon ",
    version="1.0",
)


@app.get("/")
def root():
    return {"message": "Hello l'équipe"}

@app.get("/moon")
async def get_moon_position(lat: float, lon: float):
    """
    :param lat:
    :param lon:
    :return: Returns the position of the moon for a given GPS position at time T(current time)
    """
    now = datetime.now()
    result = compute_moon_position(lat, lon, now)

    return {
        "status": "success",
        "timestamp": now.isoformat(),
        "location": {"latitude": lat, "longitude": lon},
        "data": result
    }



