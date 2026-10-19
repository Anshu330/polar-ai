// ========================================
// POLAR AI - ANTARCTIC DASHBOARD
// ========================================


// ========================================
// 1. CREATE THE MAP
// ========================================

const map = L.map("map", {
    
    center: [-70, 0],
    zoom: 3,
    minZoom: 2,
    maxZoom: 7
});

setTimeout(() => {
    map.invalidateSize();
}, 300);

// Stores the current predicted trajectory line
let predictionLine = null;
let predictionMarker = null;




/* OpenStreetMap tiles */
L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }
).addTo(map);




// ========================================
// 2. ICEBERG ICON
// ========================================

const icebergIcon = L.divIcon({

    className: "iceberg-marker",

    html: `
        <div style="
            width:12px;
            height:12px;
            background:#38bdf8;
            border:2px solid white;
            border-radius:50%;
            box-shadow:0 0 10px #38bdf8;
        "></div>
    `,

    iconSize: [12, 12],

    iconAnchor: [6, 6]

});


// ========================================
// 3. GET ICEBERG DATA FROM BACKEND
// ========================================
async function loadDashboardStats() {
    try {
        const response = await fetch("http://127.0.0.1:8000/stats");

        if (!response.ok) {
            throw new Error("Failed to load dashboard statistics");
        }

        const stats = await response.json();

        console.log("Dashboard stats:", stats);

        // Update the tracked iceberg count
        const icebergCount = document.querySelector(
            ".kpi-grid .card.kpi h2"
        );

        if (icebergCount) {
            icebergCount.textContent = stats.total_icebergs;
        }
        const latestObservation = document.getElementById(
    "latest-observation"
);

if (latestObservation) {
    latestObservation.textContent =
        `Day ${stats.latest_observation}`;
}
// ADD THE NEW RISK CODE HERE
const riskResponse = await fetch("http://127.0.0.1:8000/risk");

if (!riskResponse.ok) {
    throw new Error("Failed to load risk statistics");
}

const riskData = await riskResponse.json();

const riskCount = document.getElementById("risk-count");

if (riskCount) {
    riskCount.textContent = String(
        riskData.potential_exposure_count
    ).padStart(2, "0");
}

    } catch (error) {
        console.error("Could not load dashboard stats:", error);
    }
}

loadDashboardStats();

fetch("http://127.0.0.1:8000/icebergs")

    .then(response => {

        // Check if backend responded successfully

        if (!response.ok) {

            throw new Error(
                "Backend returned an error: " + response.status
            );

        }

        return response.json();

    })

    .then(icebergs => {

        console.log(
            "Icebergs received from backend:",
            icebergs
        );

        console.log(
            "Total icebergs:",
            icebergs.length
        );


        // ========================================
        // 4. ADD EACH ICEBERG TO MAP
        // ========================================

        icebergs.forEach(iceberg => {

            const marker = L.marker(

                [
                    iceberg.latitude,
                    iceberg.longitude
                ],

                {
                    icon: icebergIcon
                }

            ).addTo(map);


            // ========================================
            // POPUP
            // ========================================

            marker.bindPopup(`

                <div style="
                    min-width:150px;
                    font-family:Arial;
                ">

                    <h3 style="
                        margin:0 0 10px 0;
                    ">
                        🧊 ${iceberg.id}
                    </h3>

                    <p>
                        <strong>Latitude:</strong>
                        ${iceberg.latitude.toFixed(4)}°
                    </p>

                    <p>
                        <strong>Longitude:</strong>
                        ${iceberg.longitude.toFixed(4)}°
                    </p>

                    <p>
                        <strong>Observation:</strong>
                        Day ${iceberg.observation_day}
                    </p>

                </div>

            `);


            // ========================================
            // WHEN MARKER IS CLICKED
            // ========================================

            marker.on("click", function () {

                selectIceberg(

                    iceberg.id,

                    iceberg.latitude,

                    iceberg.longitude,

                    iceberg.observation_day

                );

            });

        });

    })

    .catch(error => {

        console.error(
            "Could not get iceberg data:",
            error
        );

    });


// ========================================
// 5. SELECT ICEBERG
// ========================================

function selectIceberg(
    id,
    latitude,
    longitude,
    observationDay
) {
    window.currentIcebergId = id;

    // Iceberg name

    document.getElementById(
        "selectedName"
    ).innerText = id;


    // Latitude

    document.getElementById(
        "selectedLat"
    ).innerText =
        latitude.toFixed(4) + "°";


    // Longitude

    document.getElementById(
        "selectedLon"
    ).innerText =
        longitude.toFixed(4) + "°";


    // Observation day

    document.getElementById(
        "selectedDay"
    ).innerText =
        "Day " + observationDay;


    // Current position

    document.getElementById(
        "currentPosition"
    ).innerText =
        latitude.toFixed(2) +
        "°, " +
        longitude.toFixed(2) +
        "°";


    console.log(
        "Selected iceberg:",
        id
    );

}


// ========================================
// 6. AI PREDICTION BUTTON
// ========================================

// =====================================
// 6. AI PREDICTION BUTTON
// =====================================

async function showPrediction() {

    const button = document.querySelector(".predict-btn");

    if (!button) {
        console.error("Prediction button not found.");
        return;
    }

    // Get currently selected iceberg
    const selectedNameElement = document.getElementById("selectedName");

    if (!selectedNameElement) {
        console.error("Selected iceberg element not found.");
        return;
    }

    const icebergId = selectedNameElement.innerText.trim();

    if (!icebergId) {
        console.error("No iceberg selected.");
        return;
    }

    console.log("Running AI prediction for:", icebergId);

    // Change button state
    button.innerText = "Generating Prediction...";
    button.disabled = true;

    try {

        // Call FastAPI prediction endpoint
        const response = await fetch(
            `http://127.0.0.1:8000/predict/${icebergId}`
        );

        if (!response.ok) {
            throw new Error(
                `Prediction API returned ${response.status}`
            );
        }

        const data = await response.json();

        console.log("Prediction received:", data);

        // =====================================
        // UPDATE CURRENT POSITION
        // =====================================

        const currentPosition =
            document.getElementById("currentPosition");

        if (currentPosition) {
            currentPosition.innerText =
                `${Number(data.current_latitude).toFixed(2)}°, ` +
                `${Number(data.current_longitude).toFixed(2)}°`;
        }


        // =====================================
        // UPDATE PREDICTED LATITUDE
        // =====================================

        const predictedLat =
            document.getElementById("predLat");

        if (predictedLat) {
            predictedLat.innerText =
                `${Number(data.predicted_latitude).toFixed(4)}°`;
        }


        // =====================================
        // UPDATE PREDICTED LONGITUDE
        // =====================================

        const predictedLon =
            document.getElementById("predLon");

        if (predictedLon) {
            predictedLon.innerText =
                `${Number(data.predicted_longitude).toFixed(4)}°`;
        }


        // =====================================
        // UPDATE PREDICTION TIME
        // =====================================

        const predictionHours =
            document.getElementById("predictionHours");

        if (predictionHours) {
            predictionHours.innerText =
                `${data.prediction_hours} hours`;
        }


        // =====================================
        // BUTTON SUCCESS
        // =====================================

        button.innerText = "Prediction Complete ✓";

        console.log(
            `Prediction for ${icebergId}:`,
            data.predicted_latitude,
            data.predicted_longitude
        );
        // =====================================
// DRAW PREDICTED TRAJECTORY ON MAP
// =====================================

// Remove previous prediction
if (predictionLine) {
    map.removeLayer(predictionLine);
}

if (predictionMarker) {
    map.removeLayer(predictionMarker);
}

// Current iceberg position
const currentLat = Number(data.current_latitude);
const currentLon = Number(data.current_longitude);

// Predicted position
const predictedLatValue = Number(data.predicted_latitude);
const predictedLonValue = Number(data.predicted_longitude);

// Draw line from current → predicted position
predictionLine = L.polyline(
    [
        [currentLat, currentLon],
        [predictedLatValue, predictedLonValue]
    ],
    {
        color: "#FFD166",
        weight: 4,
        opacity: 0.9,
        dashArray: "10, 8"
    }
).addTo(map);

// Add marker at predicted position
predictionMarker = L.circleMarker(
    [predictedLatValue, predictedLonValue],
    {
        radius: 9,
        color: "#FFD166",
        fillColor: "#FFD166",
        fillOpacity: 0.9,
        weight: 3
    }
).addTo(map);

predictionMarker.bindPopup(
    `<b>AI Predicted Position</b><br>
     Iceberg: ${icebergId}<br>
     Latitude: ${predictedLatValue.toFixed(4)}°<br>
     Longitude: ${predictedLonValue.toFixed(4)}°<br>
     Forecast: ${data.prediction_hours} hours`
);

console.log("Predicted trajectory drawn on map.");

        // Re-enable button
        setTimeout(() => {

            button.innerText = "Run AI Prediction";
            button.disabled = false;

        }, 2000);


    } catch (error) {

        console.error("Prediction error:", error);

        button.innerText = "Prediction Failed";

        alert(
            "Could not get prediction from the AI backend.\n\n" +
            "Make sure the FastAPI server is running."
        );

        setTimeout(() => {

            button.innerText = "Run AI Prediction";
            button.disabled = false;

        }, 2000);
    }
}

    // ----------------------------------------
    // DEMO ONLY
    // ----------------------------------------
    //
    // Later this will call:
    //
    // http://127.0.0.1:8000/predict/A83
    //
    // and use the actual ML model.
    // ----------------------------------------


    setTimeout(() => {

        document.getElementById(
            "predLat"
        ).innerText = "-53.20°";


        document.getElementById(
            "predLon"
        ).innerText = "-29.10°";


        button.innerText =
            "Prediction Generated ✓";


        button.disabled = false;

    }, 1000);




// ========================================
// 7. SEARCH ICEBERG TABLE
// ========================================

function searchTable() {

    const input =
        document
            .getElementById("search")
            .value
            .toUpperCase();


    const table =
        document.getElementById(
            "icebergTable"
        );


    const rows =
        table.getElementsByTagName("tr");


    // Start from 1 because row 0 is header

    for (
        let i = 1;
        i < rows.length;
        i++
    ) {

        const nameCell =
            rows[i]
                .getElementsByTagName("td")[0];


        if (nameCell) {

            const name =
                nameCell.textContent ||
                nameCell.innerText;


            if (
                name
                    .toUpperCase()
                    .includes(input)
            ) {

                rows[i].style.display =
                    "";

            } else {

                rows[i].style.display =
                    "none";

            }

        }

    }

}


// ========================================
// 8. TEST BACKEND CONNECTION
// ========================================

console.log(
    "POLAR AI frontend started."
);

console.log(
    "Connecting to:",
    "http://127.0.0.1:8000/icebergs"
);

async function updateDashboardStats() {
    try {
        const response = await fetch("http://127.0.0.1:8000/icebergs");

        if (!response.ok) {
            throw new Error("Failed to fetch iceberg data");
        }

        const icebergs = await response.json();

        // Update the total number of icebergs
        document.getElementById("tracked-icebergs-count").textContent =
            icebergs.length;

        // Update the latest observation day
        const latestDay = Math.max(
            ...icebergs.map(iceberg => Number(iceberg.observation_day) || 0)
        );

        document.getElementById("latest-observation-day").textContent =
            `Day ${latestDay}`;

    } catch (error) {
        console.error("Could not update dashboard statistics:", error);
    }
}

updateDashboardStats();