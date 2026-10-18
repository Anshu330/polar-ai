from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fix path to work from any directory
csv_path = os.path.join(os.path.dirname(__file__), "iceberg_data.csv")
df = pd.read_csv(csv_path)


@app.get("/")
def home():
    return {
        "message": "POLAR AI Backend is running"
    }


@app.get("/icebergs")
def get_icebergs():
    return df.to_dict(orient="records")
@app.get("/predict/{iceberg_id}")
def predict_iceberg(iceberg_id: str):

    iceberg = df[df["id"] == iceberg_id]

    if iceberg.empty:
        return {
            "error": "Iceberg not found"
        }

    current_lat = float(iceberg.iloc[0]["latitude"])
    current_lon = float(iceberg.iloc[0]["longitude"])

    # Simple prototype prediction
    predicted_lat = current_lat + 0.10
    predicted_lon = current_lon + 0.15

    return {
        "id": iceberg_id,
        "current_latitude": current_lat,
        "current_longitude": current_lon,
        "predicted_latitude": predicted_lat,
        "predicted_longitude": predicted_lon,
        "prediction_hours": 24
    }