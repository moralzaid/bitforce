# 🛡️ TRIDENT — Tri-Disciplinary Automated Bio-Fence Network for Human-Elephant Conflict (HEC) Mitigation

**A Mission-Critical Tactical Command Center & Real-Time Hardware Simulation Platform**  
Inspired by Palantir Foundry, DJI FlightHub, SpaceX telemetry systems, and modern precision-agriculture telemetry dashboards.

---

## 🎯 Executive Thesis & Problem Statement

Human-Elephant Conflict (HEC) results in hundreds of human and elephant fatalities annually, causing millions in crop losses across South Asia and Africa. Traditional single-discipline approaches fail catastrophically:
1. **Isolated Physical Deterrents (Fences/Firecrackers):** Violent tuskers learn to smash dead or low-voltage fences; firecrackers cause panicked stampedes into villages and traumatize nursing calves.
2. **Passive Camera Traps:** Detect intrusions after elephants have already penetrated village borders, offering zero autonomous deterrence.
3. **Continuous Spraying / Odor Fences:** Drains thousands of liters of deterrent chemicals within hours, contaminates agricultural soil, and costs thousands per month.

### The TRIDENT Tri-Disciplinary Solution:
TRIDENT orchestrates a synchronized, real-time feedback loop between:
* **The Brain & Eyes (Engineering Module):** Solar-powered LoRa mesh camera nodes running YOLOv8 edge AI inference at 34ms latency.
* **The Biological Intelligence (Veterinary Module):** GPS collar biometrics tracking serum testosterone ("Musth") cycles, historical aggression scores, habituation indices, and maternal calf safety overrides.
* **The Physical Deterrent (Agricultural Module):** High-pressure (145 PSI) chili-oleoresin mist solenoid manifolds, 250–550 Hz bio-acoustic honeybee arrays, and wind-drift safety lockouts.

---

## 🚀 Quick Start: How to Run the Website

### Prerequisites
* **Node.js** v18+ (tested on v26)
* **npm** v9+

### Option A — Run Both Backend and Frontend in One Command (Recommended)
From the root directory:
```bash
# Start concurrently (Server on :5000 + Frontend on :5173)
npm run dev
```

### Option B — Run Separately in Two Terminal Windows

**Terminal 1 (Backend Server):**
```bash
cd server
npm start
```
*Backend runs on:* `http://localhost:5000`

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```
*Frontend runs on:* `http://localhost:5173`

Open your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 🧪 How to Test the Website

### 1. Automated Verification Test Suite
Run the automated Jest test suite covering the Tri-Disciplinary State Machine, Chaos Dependency Engine, and REST endpoints:
```bash
cd server
npm test
```
*Result: 15 / 15 automated test suites pass (Decision Engine deterministic triggers, chaos catastrophic cascades, REST routes).*

---

### 2. Hackathon Judge Interactive Walkthrough (5-Minute Test Guide)

#### Step 1: Open the Command Center
* Visit `http://localhost:5173`
* Notice the **Top Telemetry Bar**: `MESH ONLINE`, `ENG: 100%`, `VET DB: SYNCED (4 MUSTH)`, `AGRO: 145 PSI`, and active wind drift telemetry.
* Notice the **4-Stage Pipeline Visualizer** tracking the handshake from optical beam trip to solenoid valve actuation.

#### Step 2: One-Click Instant Breach Trigger
* Click the red **"TRIGGER BREACH"** CTA button on the top right.
* Watch the live **Camera Feed Simulator** lock onto **Raja (#04)** in peak Musth with bounding box overlay and thermal signature.
* Observe the **Live Terminal Ticker** output real-time microsecond handshakes (`[ENG-NODE-04]`, `[VET-DB-SYNC]`, `[AGRO-VALVE-04B]`).
* Watch the **Perimeter Sector Map** ripple with a dynamic radar pulse at Sector 04.

#### Step 3: Test the "Fails-if-Removed" Chaos Engineering Lab
* Navigate to **"Chaos Engineering Lab"** in the sidebar (or `/chaos-lab`).
* **Test 1 — Disable Engineering:** Click *“TEST SEVERED SENSORS”*.
  * *Visual Effect:* Camera feed drops into static noise and red alarm watermark; perimeter sector nodes turn gray.
  * *Outcome:* `[CATASTROPHIC FAILURE: SYSTEM BLIND]` — Elephant reaches village homelands undetected; zero early warning.
* **Test 2 — Disable Veterinary:** Click *“TEST BIOMETRIC LOSS”*.
  * *Outcome:* `[CATASTROPHIC FAILURE: INDISCRIMINATE FIRING & HABITUATION]` — Blasts nursing calves with high chemical spray, causing stampedes; habituated bulls learn to ignore alarms.
* **Test 3 — Disable Agriculture:** Click *“TEST 0 PSI FAILURE”*.
  * *Visual Effect:* Line pressure drops to 0 PSI; acoustic arrays mute.
  * *Outcome:* `[CATASTROPHIC FAILURE: ZERO PHYSICAL DETERRENCE]` — AI sees the bull, Vet flags critical danger, but 0 PSI payload allows the elephant to trample the harvest.
* Click **"RESTORE NOMINAL STATE"** to recharge all tanks and reset the mesh.

#### Step 4: Step-by-Step Breach Simulator Sandbox
* Navigate to **"Breach Simulator"** (`/breach-simulator`).
* Click **"Matriarch with Calves"** preset: Observe how TRIDENT switches from chemical mist to gentle **Tier 1 Bio-Acoustic Honeybee Swarm (340 Hz)** to protect newborn calves.
* Click **"Non-Target Wildlife"** (Wild Boar): Observe how the edge AI filters harmless wildlife and stands by (0 deterrent wasted).
* Adjust the **Wind Direction** slider to blow toward village houses: Observe the automated **Wind Blowback Safety Lock** engage to prevent toxic aerosol drift.

#### Step 5: Explore Discipline Dashboards
* **Engineering Hub (`/engineering`):** View 12 solar LoRa nodes, run live remote diagnostics, adjust YOLOv8 confidence gates.
* **Veterinary Biometrics (`/veterinary`):** Directory of 15 collared elephants, Musth testosterone dials, and individual dossier deep dives (`/veterinary/el_001`).
* **Agricultural Control (`/agriculture`):** 6 bio-buffer zones, chili tank levels, 145 PSI gauges, and acoustic bee frequency calibration sliders (250–550 Hz).
* **Incident History & Post-Mortem (`/incidents`):** Searchable audit trail with exact millisecond latency waterfalls (`t0` through `t5`).
* **System Architecture Blueprint (`/architecture`):** Comprehensive pitch deck diagram explaining the technical thesis to judges.

---

## 👥 Instant Demo Accounts & Role Switcher

No passwords required — click the **"ACTIVE ROLE"** badge in the top right navbar to instantly switch roles on the fly:

| Role | Access Permissions |
|---|---|
| **Hackathon Judge / Admin** | Full access, Chaos Lab overrides, simulation controls, reset hardware |
| **Veterinary Officer** | Update Musth hormone levels, edit aggression scores, ethical calf overrides |
| **Field Engineer** | Camera edge nodes, AI confidence thresholds, remote diagnostics ping |
| **Agricultural Officer** | Chili reservoir refills, pneumatic line pressure, acoustic frequency tuning |

---

## 🏗️ Technical Architecture & REST API Endpoints

### Backend Routes:
* `POST /api/simulate/breach` — Executes full Engineering $\rightarrow$ Vet $\rightarrow$ Agro state machine
* `POST /api/simulate/chaos-test` — Executes Chaos Dependency cascading failure simulator
* `POST /api/simulate/reset` — Replenishes chili tanks to 500L and resets node hardware
* `GET /api/simulate/state` — Returns live telemetry and module health metrics
* `GET /api/elephants` — Filterable directory of 15 GPS-collared elephants
* `GET /api/nodes` — Telemetry for 12 solar LoRa nodes
* `GET /api/agro-zones` — Line pressures and tank levels for 6 agricultural zones
* `GET /api/incidents` — Searchable chronological incident audit logs
* `GET /api/analytics/overview` — KPI metrics, encounter trends, and deterrent tier distribution

---

## 📁 Repository Structure
```
trident-hec/
├── client/                     # Vite + React + Tailwind + Recharts Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── command/        # Pipeline visualizer, live terminal, tactical map, camera feed
│   │   │   ├── chaos/          # Fails-if-Removed interactive toggles & comparison matrix
│   │   │   ├── engineering/    # Node cards & diagnostics
│   │   │   ├── veterinary/     # Musth gauges & elephant dossiers
│   │   │   ├── agriculture/    # PSI gauges, chili tank meters, acoustic frequency sliders
│   │   │   └── common/         # Navbar with telemetry bar & Sidebar
│   │   ├── pages/              # 16 complete tactical pages
│   │   ├── context/            # AuthContext & SimulationContext
│   │   └── services/           # Axios API client
├── server/                     # Node.js + Express + Socket.io Backend
│   ├── config/                 # Turnkey DB configuration
│   ├── controllers/            # Simulation, Vet, Eng, Agro, Auth, Incident controllers
│   ├── models/                 # Mongoose schemas (Elephant, Node, AgroZone, Incident, Chaos)
│   ├── routes/                 # RESTful API route definitions
│   ├── services/
│   │   ├── decisionEngine.js   # Core Tri-Disciplinary State Machine
│   │   ├── chaosEngine.js      # Fails-if-Removed Cascading Failure Calculator
│   │   └── tacticalStore.js    # In-memory tactical repository for 100% turnkey evaluation
│   ├── seed/                   # Realistic seed dataset
│   └── tests/                  # Automated Jest verification test suite
└── README.md
```

---

*TRIDENT — Tri-Disciplinary Automated Bio-Fence Network. Built for zero-casualty human-elephant coexistence.*

