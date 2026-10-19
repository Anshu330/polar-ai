from fastapi import FastAPI, HTTPException
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

# Validate required columns
required_columns = [
    "id",
    "latitude",
    "longitude",
    "observation_day"
]

missing_columns = set(required_columns) - set(df.columns)

if missing_columns:
    raise ValueError(
        f"Missing required CSV columns: {missing_columns}"
    )

# Validate missing values
if df[required_columns].isnull().any().any():
    raise ValueError("CSV contains missing values.")

# Validate duplicate iceberg IDs
if df["id"].duplicated().any():
    raise ValueError("CSV contains duplicate iceberg IDs.")

# Validate coordinate ranges
if not df["latitude"].between(-90, 90).all():
    raise ValueError("Invalid latitude values found.")

if not df["longitude"].between(-180, 180).all():
    raise ValueError("Invalid longitude values found.")

# Validate observation days
if (df["observation_day"] < 1).any():
    raise ValueError("Observation days must be positive.")

# Validate the iceberg dataset
required_columns = ["id", "latitude", "longitude", "observation_day"]

missing_columns = [
    column for column in required_columns
    if column not in df.columns
]

if missing_columns:
    raise ValueError(
        f"Missing required columns in iceberg_data.csv: {missing_columns}"
    )

if df["id"].isna().any():
    raise ValueError("Iceberg dataset contains missing IDs.")

if df["id"].duplicated().any():
    raise ValueError("Iceberg dataset contains duplicate IDs.")

df["latitude"] = pd.to_numeric(df["latitude"], errors="raise")
df["longitude"] = pd.to_numeric(df["longitude"], errors="raise")
df["observation_day"] = pd.to_numeric(
    df["observation_day"], errors="raise"
)

if not df["latitude"].between(-90, 90).all():
    raise ValueError("Latitude values must be between -90 and 90.")

if not df["longitude"].between(-180, 180).all():
    raise ValueError("Longitude values must be between -180 and 180.")

if df[["latitude", "longitude", "observation_day"]].isna().any().any():
    raise ValueError("Iceberg dataset contains missing numeric values.")


@app.get("/")
def home():
    return {
        "message": "POLAR AI Backend is running"
    }


@app.get("/icebergs")
def get_icebergs():
    return df.to_dict(orient="records")
@app.get("/stats")
def get_stats():
    total_icebergs = len(df)

    latest_observation = int(df["observation_day"].max())

    return {
        "total_icebergs": total_icebergs,
        "latest_observation": latest_observation
    }
@app.get("/risk")
def get_risk():
    region = df[
        (df["latitude"] >= -65) &
        (df["latitude"] <= -55) &
        (df["longitude"] >= -60) &
        (df["longitude"] <= -40)
    ]

    return {
        "potential_exposure_count": int(len(region)),
        "region": {
            "min_latitude": -65,
            "max_latitude": -55,
            "min_longitude": -60,
            "max_longitude": -40
        }
    }
@app.get("/predict/{iceberg_id}")
def predict_iceberg(iceberg_id: str):

    iceberg_id = iceberg_id.strip().upper()
    iceberg = df[df["id"].astype(str).str.upper() == iceberg_id]

    if iceberg.empty:    
           raise HTTPException(        
            status_code=404,
            detail="Iceberg not found"
        )

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