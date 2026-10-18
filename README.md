# 🧊 POLAR AI

**Tracking icebergs. Exploring where they drift next.**

POLAR AI is a project I'm building to explore how technology can help us understand iceberg movement in Antarctic waters. It combines an interactive map, iceberg datasets, and a backend that generates prototype trajectory predictions.

I'm still working on it, and there's a lot more I want to build.

### 🌊 What's working so far?

- 🗺️ **Iceberg tracking** — Explore iceberg positions on an interactive map.
- 📍 **Iceberg details** — Select an iceberg and inspect its coordinates and observation data.
- 🤖 **Trajectory prediction** — Generate a basic predicted position using the backend.
- ⚠️ **Risk dashboard** — View navigation risk indicators in the interface.
- 🔎 **Data search** — Find icebergs in the dashboard table.

### 🛠️ Built with

`HTML` · `CSS` · `JavaScript` · `Python` · `FastAPI` · `Pandas` · `Leaflet.js`

### 📂 Inside the project

```text
polar-ai/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── backend/
    ├── main.py
    ├── iceberg_data.csv
    └── requirements.txt
```

### 🚀 Run it locally

**1. Install the Python dependencies**

```bash
pip install -r backend/requirements.txt
```

**2. Start the backend**

```bash
cd backend
uvicorn main:app --reload
```

API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

**3. Open the frontend**

Open `frontend/index.html` with VS Code Live Server.

### 🧪 Current status

This is a work in progress. The trajectory prediction currently uses a simple coordinate offset, not a trained ML model. Some risk indicators are demo values, too.

The goal is to develop this into a more useful platform for exploring iceberg movement and Antarctic navigation data.

*Built as a learning project, one feature at a time.* ❄️
