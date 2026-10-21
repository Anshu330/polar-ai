# 🧊 POLAR AI

### Antarctic Iceberg Tracking & Trajectory Prediction Dashboard

**Track icebergs. Explore their movement. Investigate safer Antarctic navigation.**

POLAR AI is a web-based prototype designed to explore iceberg tracking and trajectory prediction in Antarctic waters. It combines an interactive map, iceberg observation data, a risk dashboard, and a FastAPI backend to demonstrate how technology can support polar navigation research.

## ✨ Features

- 🗺️ **Interactive Iceberg Map** — Visualize iceberg locations using an interactive Leaflet map.
- 📍 **Iceberg Tracking** — Explore iceberg coordinates and available observation data.
- 🤖 **Trajectory Prediction** — Generate prototype future positions using a basic coordinate-offset method.
- ⚠️ **Risk Dashboard** — View preliminary navigation risk indicators.
- 🔎 **Iceberg Search** — Search and explore iceberg records in the dashboard table.
- 📊 **Dashboard Statistics** — View summary information about the available dataset.
- ⚡ **REST API** — Retrieve iceberg data, statistics, risk information, and prediction results through FastAPI.
- 🧪 **Backend Tests** — Validate core API functionality using pytest.

## 🖥️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Dashboard structure |
| CSS3 | Styling and responsive layout |
| JavaScript | Frontend functionality and API integration |
| Python | Backend logic |
| FastAPI | REST API development |
| Pandas | Dataset handling |
| Leaflet.js | Interactive mapping |
| OpenStreetMap | Map tiles |
| Pytest | Backend testing |

## 📂 Project Structure

```text
polar-ai/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── main.py
│   ├── iceberg_data.csv
│   ├── requirements.txt
│   └── tests/
│       └── test_main.py
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python installed on your system
- Visual Studio Code
- VS Code Live Server extension (for the frontend)

### 1. Clone the repository

```bash
git clone https://github.com/Anshu330/polar-ai.git
cd polar-ai
```

### 2. Install dependencies

```bash
pip install -r backend/requirements.txt
```

### 3. Start the backend server

Open a terminal in the project root and run:

```bash
cd backend
py -m uvicorn main:app --reload
```

The backend API will be available at:

- **API base URL:** http://127.0.0.1:8000
- **Interactive API documentation:** http://127.0.0.1:8000/docs

### 4. Launch the frontend

Open `frontend/index.html` in Visual Studio Code and select **Open with Live Server**.

Keep the backend running while using the dashboard.

### 5. Run backend tests

From the project root, execute:

```bash
py -m pytest backend/tests -q
```

The existing test suite has passed all 6 tests in the current development setup.

## 🔌 API Endpoints

| Endpoint | Description |
|---|---|
| `GET /` | Check the API status |
| `GET /icebergs` | Retrieve iceberg records |
| `GET /stats` | Retrieve dashboard statistics |
| `GET /risk` | Retrieve prototype risk information |
| `GET /predict/{iceberg_id}` | Generate a prototype iceberg position prediction |

For response formats and interactive testing, visit `/docs` after starting the backend.

## ⚠️ Current Limitations

POLAR AI is an educational prototype and is still under development.

- **Prediction:** Uses a simple coordinate offset rather than a trained machine-learning model.
- **Risk assessment:** Includes prototype indicators and should not be used for real navigation decisions.
- **Data:** Results depend on the records currently available in the project dataset.
- **Navigation:** The application does not yet provide a validated route-optimization system.

The current prototype is intended for learning, experimentation, and demonstrating a possible approach to iceberg tracking.

## 🛣️ Future Improvements

- Integrate reliable satellite imagery and updated iceberg observation datasets.
- Develop and evaluate machine-learning models for iceberg trajectory prediction.
- Incorporate ocean currents, wind, sea-ice concentration, and meteorological data.
- Improve navigation risk assessment using validated environmental data.
- Explore fuel-efficient route planning and obstacle avoidance.
- Add historical trajectory visualization and prediction evaluation metrics.

## 🎯 Project Goal

The long-term goal of POLAR AI is to explore how data analysis, mapping, and machine learning can help researchers investigate iceberg movement and support safer, more efficient Antarctic navigation.

## 👨‍💻 Author

**Anshu Kumar**

Computer Science Engineering Student

[GitHub Repository](https://github.com/Anshu330/polar-ai)

---

*Built with curiosity, code, and a vision for smarter polar exploration. 🧊*
