const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectDB } = require('../config/db');

const User = require('../models/User');
const ElephantProfile = require('../models/ElephantProfile');
const PerimeterNode = require('../models/PerimeterNode');
const AgroZone = require('../models/AgroZone');
const BreachIncident = require('../models/BreachIncident');
const SystemConfig = require('../models/SystemConfig');

dotenv.config();

const seedTacticalData = async () => {
  console.log('[SEED] Clearing existing collections...');
  await User.deleteMany({});
  await ElephantProfile.deleteMany({});
  await PerimeterNode.deleteMany({});
  await AgroZone.deleteMany({});
  await BreachIncident.deleteMany({});
  await SystemConfig.deleteMany({});

  // 1. Seed Users (4 Pre-configured Demo Accounts)
  console.log('[SEED] Creating 4 Tactical Demo Accounts...');
  const users = await User.create([
    {
      name: 'Dr. Zaid Al-Mansoor (Chief Evaluator)',
      email: 'judge@trident.hec',
      password: 'Password123!',
      role: 'Judge/Admin',
      badgeNumber: 'JUDGE-01',
      department: 'Tactical Evaluation Board'
    },
    {
      name: 'Dr. Radhika Perera (Wildlife Vet)',
      email: 'vet@trident.hec',
      password: 'Password123!',
      role: 'Veterinary Officer',
      badgeNumber: 'VET-704',
      department: 'Department of Wildlife Conservation'
    },
    {
      name: 'Eng. Kaveen Silva (IoT Mesh Architect)',
      email: 'engineer@trident.hec',
      password: 'Password123!',
      role: 'Field Engineer',
      badgeNumber: 'ENG-219',
      department: 'Autonomous Mesh Infrastructure'
    },
    {
      name: 'Ananda Bandara (Agro Agronomist)',
      email: 'agro@trident.hec',
      password: 'Password123!',
      role: 'Agricultural Officer',
      badgeNumber: 'AGR-408',
      department: 'Agrarian Buffer Zone Protection'
    }
  ]);

  // 2. Seed 12 Perimeter Sector Nodes
  console.log('[SEED] Deploying 12 Perimeter Sector Nodes along Forest-Paddy Corridor...');
  const baseLat = 6.8219;
  const baseLng = 80.9982;
  const sectorNames = [
    'Sector 01 - Habarana Sanctuary Gate',
    'Sector 02 - Minneriya Forest Transit Corridor',
    'Sector 03 - Hurulu Eco-Buffer Link',
    'Sector 04 - North Paddy Buffer (High Activity)',
    'Sector 05 - Paluwewa Settlement Perimeter',
    'Sector 06 - Sigiriya Western Scrubland Boundary',
    'Sector 07 - Kandalama Water Reservoir Flank',
    'Sector 08 - Gal Oya South Riparian Strip',
    'Sector 09 - Dambulla Agrarian Outskirts',
    'Sector 10 - Habarana Railway Crossing Zone',
    'Sector 11 - Mahaweli Feeder Canal Line',
    'Sector 12 - Mahaweli East Paddy Border'
  ];

  const nodes = [];
  for (let i = 0; i < 12; i++) {
    const num = String(i + 1).padStart(2, '0');
    // Simulate slight zig-zag coordinates along fence boundary
    const lat = Number((baseLat + (i * 0.008) + ((i % 2 === 0 ? 1 : -1) * 0.002)).toFixed(4));
    const lng = Number((baseLng + (i * 0.009) + ((i % 3 === 0 ? 1 : -1) * 0.003)).toFixed(4));

    nodes.push({
      nodeId: `NODE-${num}`,
      sectorName: sectorNames[i],
      coordinates: { latitude: lat, longitude: lng },
      solarBatteryLevel: i === 3 ? 98 : Math.floor(82 + Math.random() * 16),
      pvChargingState: i % 4 === 0 ? 'Bulk Charging' : 'Float',
      aiEdgeStatus: 'Online',
      aiConfidenceThreshold: 85,
      solenoidValveIds: [`SOL-${num}A`, `SOL-${num}B`],
      acousticArrayIds: [`SPK-${num}-NORTH`, `SPK-${num}-SOUTH`],
      latencyMs: Math.floor(32 + Math.random() * 18),
      loraRssiDbm: -Math.floor(62 + Math.random() * 14),
      meshHopCount: i < 4 ? 1 : (i < 8 ? 2 : 3),
      hardwareStatus: 'Nominal'
    });
  }
  const createdNodes = await PerimeterNode.create(nodes);

  // 3. Seed 15 Realistic Elephant Profiles
  console.log('[SEED] Registering 15 GPS-Collared Elephants & Herds with Biometrics...');
  const elephantSeedData = [
    {
      collarId: 'EL-001',
      name: 'Raja (Apex Bull)',
      classification: 'Solitary Bull',
      age: 44,
      estimatedWeightKg: 5600,
      morphotype: 'Tusker',
      musthStatus: 'Active',
      testosteroneIndex: 96,
      aggressionScore: 9.4,
      habituationIndex: 32,
      calvesPresent: false,
      calfCount: 0,
      herdSize: 1,
      temporalDrainageActive: true,
      breachCount: 19,
      recommendedProtocol: 'Max_Pressure_Chili_Curtain',
      bioNotes: 'Dominant breeding tusker in peak Musth. Copious temporal drainage, extreme testosterone surge, history of breaking unpressurized fences.'
    },
    {
      collarId: 'EL-002',
      name: 'Kumari Matriarch & Herd',
      classification: 'Matriarch Herd',
      age: 48,
      estimatedWeightKg: 3800,
      morphotype: 'Female / Cow',
      musthStatus: 'N/A - Female',
      testosteroneIndex: 8,
      aggressionScore: 2.4,
      habituationIndex: 12,
      calvesPresent: true,
      calfCount: 3,
      herdSize: 14,
      temporalDrainageActive: false,
      breachCount: 6,
      recommendedProtocol: 'Acoustic_Bee_Only',
      bioNotes: 'Experienced herd leader accompanied by 3 nursing calves (ages 4 mo - 2 yrs). High maternal protective instincts; chemical mist strictly forbidden.'
    },
    {
      collarId: 'EL-003',
      name: 'Gaja (Habituated Raider)',
      classification: 'Solitary Bull',
      age: 36,
      estimatedWeightKg: 4900,
      morphotype: 'Makna (Tuskless Bull)',
      musthStatus: 'Pre-Musth',
      testosteroneIndex: 64,
      aggressionScore: 7.8,
      habituationIndex: 78,
      calvesPresent: false,
      calfCount: 0,
      herdSize: 1,
      temporalDrainageActive: false,
      breachCount: 28,
      recommendedProtocol: 'Dual_Acoustic_Chili_Pulse',
      bioNotes: 'Highly intelligent crop-raider habituated to single-tone acoustic alarms. Requires modulated bee swarm frequencies paired with dynamic micro-pulses.'
    },
    {
      collarId: 'EL-004',
      name: 'Bhumi (Calm Matriarch)',
      classification: 'Matriarch Herd',
      age: 52,
      estimatedWeightKg: 4100,
      morphotype: 'Female / Cow',
      musthStatus: 'N/A - Female',
      testosteroneIndex: 6,
      aggressionScore: 1.8,
      habituationIndex: 10,
      calvesPresent: true,
      calfCount: 2,
      herdSize: 9,
      temporalDrainageActive: false,
      breachCount: 3,
      recommendedProtocol: 'Acoustic_Bee_Only',
      bioNotes: 'Cautious elder matriarch. Quickly retreats upon hearing honeybee wingbeat hum (380 Hz) without needing chemical deterrence.'
    },
    {
      collarId: 'EL-005',
      name: 'Chandi (Young Aggressor)',
      classification: 'Solitary Bull',
      age: 26,
      estimatedWeightKg: 4300,
      morphotype: 'Tusker',
      musthStatus: 'Active',
      testosteroneIndex: 88,
      aggressionScore: 8.9,
      habituationIndex: 22,
      calvesPresent: false,
      calfCount: 0,
      herdSize: 1,
      temporalDrainageActive: true,
      breachCount: 11,
      recommendedProtocol: 'Max_Pressure_Chili_Curtain',
      bioNotes: 'Young bull entering early high-intensity Musth. Highly reactive to flashing vehicle lights; requires automated high-pressure chili mist buffer.'
    },
    {
      collarId: 'EL-006',
      name: 'Hurulu Bachelor Band (Dev & Trio)',
      classification: 'Bachelor Group',
      age: 28,
      estimatedWeightKg: 4200,
      morphotype: 'Makna (Tuskless Bull)',
      musthStatus: 'Pre-Musth',
      testosteroneIndex: 52,
      aggressionScore: 5.8,
      habituationIndex: 44,
      calvesPresent: false,
      calfCount: 0,
      herdSize: 4,
      temporalDrainageActive: false,
      breachCount: 15,
      recommendedProtocol: 'Dual_Acoustic_Chili_Pulse',
      bioNotes: 'Group of 4 sub-adult males testing perimeter boundaries during ripe paddy harvest season.'
    },
    {
      collarId: 'EL-007',
      name: 'Menike (Docile Herd Leader)',
      classification: 'Matriarch Herd',
      age: 39,
      estimatedWeightKg: 3600,
      morphotype: 'Female / Cow',
      musthStatus: 'N/A - Female',
      testosteroneIndex: 5,
      aggressionScore: 2.1,
      habituationIndex: 15,
      calvesPresent: true,
      calfCount: 1,
      herdSize: 8,
      temporalDrainageActive: false,
      breachCount: 4,
      recommendedProtocol: 'Acoustic_Bee_Only',
      bioNotes: 'Family herd with one 8-month-old female calf. Sensitive to 320 Hz hive frequencies.'
    },
    {
      collarId: 'EL-008',
      name: 'Bhanu (Old Giant Tusker)',
      classification: 'Solitary Bull',
      age: 58,
      estimatedWeightKg: 5800,
      morphotype: 'Tusker',
      musthStatus: 'Post-Musth',
      testosteroneIndex: 32,
      aggressionScore: 4.5,
      habituationIndex: 65,
      calvesPresent: false,
      calfCount: 0,
      herdSize: 1,
      temporalDrainageActive: false,
      breachCount: 22,
      recommendedProtocol: 'Dual_Acoustic_Chili_Pulse',
      bioNotes: 'Venerable tusker with massive ivory. Slowly transits traditional forest trails; gentle dual acoustic pulse is sufficient.'
    },
    {
      collarId: 'EL-009',
      name: 'Vikram (Agitated Lone Raider)',
      classification: 'Solitary Bull',
      age: 33,
      estimatedWeightKg: 4700,
      morphotype: 'Makna (Tuskless Bull)',
      musthStatus: 'Active',
      testosteroneIndex: 91,
      aggressionScore: 8.7,
      habituationIndex: 38,
      calvesPresent: false,
      calfCount: 0,
      herdSize: 1,
      temporalDrainageActive: true,
      breachCount: 16,
      recommendedProtocol: 'Max_Pressure_Chili_Curtain',
      bioNotes: 'Repeatedly attempts to access stored grain silos in Paluwewa village during dusk.'
    },
    {
      collarId: 'EL-010',
      name: 'Sita (River Crossing Matriarch)',
      classification: 'Matriarch Herd',
      age: 46,
      estimatedWeightKg: 3900,
      morphotype: 'Female / Cow',
      musthStatus: 'N/A - Female',
      testosteroneIndex: 9,
      aggressionScore: 3.1,
      habituationIndex: 18,
      calvesPresent: true,
      calfCount: 2,
      herdSize: 11,
      temporalDrainageActive: false,
      breachCount: 5,
      recommendedProtocol: 'Acoustic_Bee_Only',
      bioNotes: 'Follows Mahaweli canal corridors. Protects two yearlings; responds to acoustic swarm arrays.'
    },
    {
      collarId: 'EL-011',
      name: 'Ashoka (Young Sub-Adult)',
      classification: 'Solitary Bull',
      age: 22,
      estimatedWeightKg: 3400,
      morphotype: 'Makna (Tuskless Bull)',
      musthStatus: 'Pre-Musth',
      testosteroneIndex: 45,
      aggressionScore: 4.8,
      habituationIndex: 20,
      calvesPresent: false,
      calfCount: 0,
      herdSize: 1,
      temporalDrainageActive: false,
      breachCount: 7,
      recommendedProtocol: 'Dual_Acoustic_Chili_Pulse',
      bioNotes: 'Newly dispersed male exploring agrarian boundaries.'
    },
    {
      collarId: 'EL-012',
      name: 'Ganga (Forest Border Cow)',
      classification: 'Matriarch Herd',
      age: 35,
      estimatedWeightKg: 3700,
      morphotype: 'Female / Cow',
      musthStatus: 'N/A - Female',
      testosteroneIndex: 6,
      aggressionScore: 2.0,
      habituationIndex: 14,
      calvesPresent: false,
      calfCount: 0,
      herdSize: 6,
      temporalDrainageActive: false,
      breachCount: 2,
      recommendedProtocol: 'Acoustic_Bee_Only',
      bioNotes: 'Docile female group browsing border acacia.'
    },
    {
      collarId: 'EL-013',
      name: 'Maha Sen (Raging Bull)',
      classification: 'Solitary Bull',
      age: 41,
      estimatedWeightKg: 5300,
      morphotype: 'Tusker',
      musthStatus: 'Active',
      testosteroneIndex: 98,
      aggressionScore: 9.6,
      habituationIndex: 40,
      calvesPresent: false,
      calfCount: 0,
      herdSize: 1,
      temporalDrainageActive: true,
      breachCount: 18,
      recommendedProtocol: 'Max_Pressure_Chili_Curtain',
      bioNotes: 'One of the most dangerous bulls in Central Province. High charge probability; zero tolerance deterrence needed.'
    },
    {
      collarId: 'EL-014',
      name: 'Thushara (Wandering Makna)',
      classification: 'Solitary Bull',
      age: 38,
      estimatedWeightKg: 4600,
      morphotype: 'Makna (Tuskless Bull)',
      musthStatus: 'Post-Musth',
      testosteroneIndex: 28,
      aggressionScore: 4.2,
      habituationIndex: 50,
      calvesPresent: false,
      calfCount: 0,
      herdSize: 1,
      temporalDrainageActive: false,
      breachCount: 13,
      recommendedProtocol: 'Dual_Acoustic_Chili_Pulse',
      bioNotes: 'Frequent wanderer near railway lines. Highly responsive to combined audio-scent deterrence.'
    },
    {
      collarId: 'EL-015',
      name: 'Anula (Sanctuary Clan)',
      classification: 'Matriarch Herd',
      age: 44,
      estimatedWeightKg: 4000,
      morphotype: 'Female / Cow',
      musthStatus: 'N/A - Female',
      testosteroneIndex: 7,
      aggressionScore: 2.2,
      habituationIndex: 9,
      calvesPresent: true,
      calfCount: 2,
      herdSize: 12,
      temporalDrainageActive: false,
      breachCount: 4,
      recommendedProtocol: 'Acoustic_Bee_Only',
      bioNotes: 'Resides primarily in Minneriya core. Occasional wet-season excursions toward banana smallholdings.'
    }
  ];

  const createdElephants = [];
  for (const elData of elephantSeedData) {
    // Generate hormone timeline
    const history = [];
    for (let h = 6; h >= 0; h--) {
      const pastDate = new Date(Date.now() - h * 7 * 24 * 60 * 60 * 1000);
      const testVal = elData.musthStatus === 'Active'
        ? Math.max(30, Math.min(100, elData.testosteroneIndex - (h * 4) + Math.floor(Math.random() * 8)))
        : Math.max(5, elData.testosteroneIndex + Math.floor(Math.random() * 6));
      history.push({
        timestamp: pastDate,
        testosteroneIndex: testVal,
        musthStatus: elData.musthStatus,
        aggressionScore: elData.aggressionScore
      });
    }
    elData.hormoneHistory = history;
    const el = await ElephantProfile.create(elData);
    createdElephants.push(el);
  }

  // 4. Seed 6 Agricultural Buffer Zones
  console.log('[SEED] Configuring 6 Agricultural Bio-Buffer Zones...');
  const agroZonesData = [
    {
      zoneId: 'ZONE-01',
      name: 'North Paddy Buffer Area (Habarana)',
      bufferCropType: 'Chili-Citronella Barrier',
      sectorIds: ['NODE-01', 'NODE-02', 'NODE-03', 'NODE-04'],
      chiliTankCapacityLiters: 500,
      chiliTankCurrentLiters: 468,
      linePressurePsi: 148,
      acousticFrequencyHz: 380,
      acousticDecibels: 94,
      windSpeedKmh: 11,
      windDirectionDeg: 185,
      windSafetyLockActive: false,
      cropValuationUsd: 92000,
      villagesProtected: ['Habarana North Village', 'Hiriwadunna Settlement'],
      status: 'Armoured & Ready'
    },
    {
      zoneId: 'ZONE-02',
      name: 'Paluwewa Homestead Buffer',
      bufferCropType: 'Palmyra Bio-Fence',
      sectorIds: ['NODE-05', 'NODE-06'],
      chiliTankCapacityLiters: 500,
      chiliTankCurrentLiters: 420,
      linePressurePsi: 142,
      acousticFrequencyHz: 360,
      acousticDecibels: 92,
      windSpeedKmh: 14,
      windDirectionDeg: 170,
      windSafetyLockActive: false,
      cropValuationUsd: 74000,
      villagesProtected: ['Paluwewa Main Hamlet', 'Wewala Farming Colony'],
      status: 'Armoured & Ready'
    },
    {
      zoneId: 'ZONE-03',
      name: 'Kandalama Southern Flank',
      bufferCropType: 'Ginger-Lemongrass Buffer',
      sectorIds: ['NODE-07', 'NODE-08'],
      chiliTankCapacityLiters: 500,
      chiliTankCurrentLiters: 485,
      linePressurePsi: 150,
      acousticFrequencyHz: 400,
      acousticDecibels: 90,
      windSpeedKmh: 9,
      windDirectionDeg: 195,
      windSafetyLockActive: false,
      cropValuationUsd: 115000,
      villagesProtected: ['Kandalama Agrarian Belt', 'Kalundewa Agro Sector'],
      status: 'Armoured & Ready'
    },
    {
      zoneId: 'ZONE-04',
      name: 'Dambulla High-Yield Vegetable Perimeter',
      bufferCropType: 'Chili-Citronella Barrier',
      sectorIds: ['NODE-09', 'NODE-10'],
      chiliTankCapacityLiters: 500,
      chiliTankCurrentLiters: 410,
      linePressurePsi: 144,
      acousticFrequencyHz: 380,
      acousticDecibels: 96,
      windSpeedKmh: 16,
      windDirectionDeg: 180,
      windSafetyLockActive: false,
      cropValuationUsd: 140000,
      villagesProtected: ['Dambulla Outskirts', 'Athuparayaya Village'],
      status: 'Armoured & Ready'
    },
    {
      zoneId: 'ZONE-05',
      name: 'Mahaweli Canal Feeder Corridor',
      bufferCropType: 'Acacia Deterrent Hedgerow',
      sectorIds: ['NODE-11'],
      chiliTankCapacityLiters: 500,
      chiliTankCurrentLiters: 492,
      linePressurePsi: 146,
      acousticFrequencyHz: 350,
      acousticDecibels: 88,
      windSpeedKmh: 8,
      windDirectionDeg: 210,
      windSafetyLockActive: false,
      cropValuationUsd: 65000,
      villagesProtected: ['Elahera Settlement'],
      status: 'Armoured & Ready'
    },
    {
      zoneId: 'ZONE-06',
      name: 'Mahaweli East Paddy Border',
      bufferCropType: 'Paddy Field Perimeter',
      sectorIds: ['NODE-12'],
      chiliTankCapacityLiters: 500,
      chiliTankCurrentLiters: 445,
      linePressurePsi: 145,
      acousticFrequencyHz: 380,
      acousticDecibels: 92,
      windSpeedKmh: 13,
      windDirectionDeg: 190,
      windSafetyLockActive: false,
      cropValuationUsd: 88000,
      villagesProtected: ['Bakamuna Border Homesteads'],
      status: 'Armoured & Ready'
    }
  ];
  await AgroZone.create(agroZonesData);

  // 5. Seed 25 Historical Breach Incidents
  console.log('[SEED] Logging 25 Realistic Historical Encounters & Post-Mortems...');
  const incidents = [];
  const raja = createdElephants.find(e => e.collarId === 'EL-001') || createdElephants[0];
  const kumari = createdElephants.find(e => e.collarId === 'EL-002') || createdElephants[1];
  const gaja = createdElephants.find(e => e.collarId === 'EL-003') || createdElephants[2];

  for (let i = 1; i <= 25; i++) {
    const isRaja = i % 3 === 0;
    const isKumari = i % 3 === 1;
    const currentSubject = isRaja ? raja : (isKumari ? kumari : gaja);
    const nodeIdx = (i * 3) % 12;
    const currentNode = createdNodes[nodeIdx];
    const timestamp = new Date(Date.now() - (26 - i) * 18 * 60 * 60 * 1000);

    let outcome = 'Deterred - Retreated to Sanctuary Buffer';
    let deterrentDeployed = 'Dual_Acoustic_Chili_Pulse_Tier2';
    let chiliDischargedLiters = 3.5;
    let valveDurationSec = 4;
    let acousticFrequencyHz = 380;
    let damagePreventedUsd = 3400;

    if (isRaja) {
      outcome = 'Violent Charge Halted by Chili Curtain';
      deterrentDeployed = 'High_Pressure_Chili_Curtain_Tier3';
      chiliDischargedLiters = 8.5;
      valveDurationSec = 8;
      acousticFrequencyHz = 520;
      damagePreventedUsd = 9200;
    } else if (isKumari) {
      outcome = 'Herd Redirected - Calves Protected';
      deterrentDeployed = 'Acoustic_Bee_Swarm_Tier1';
      chiliDischargedLiters = 0;
      valveDurationSec = 0;
      acousticFrequencyHz = 340;
      damagePreventedUsd = 4800;
    }

    incidents.push({
      incidentCode: `INC-${202600 + i}`,
      timestamp,
      nodeId: currentNode.nodeId,
      sectorName: currentNode.sectorName,
      coordinates: currentNode.coordinates,
      elephantId: currentSubject._id,
      elephantName: currentSubject.name,
      collarId: currentSubject.collarId,
      subjectType: 'Elephant',
      engineering: {
        aiConfidence: Number((96.2 + Math.random() * 3.5).toFixed(1)),
        opticalTrigger: true,
        thermalDeltaC: Number((4.2 + Math.random() * 2.1).toFixed(1)),
        networkLatencyMs: Math.floor(34 + Math.random() * 15),
        solarLevel: currentNode.solarBatteryLevel,
        boundingBox: { x: 130, y: 90, width: 380, height: 410 }
      },
      veterinary: {
        musthStatus: currentSubject.musthStatus,
        testosteroneIndex: currentSubject.testosteroneIndex,
        aggressionScore: currentSubject.aggressionScore,
        habituationIndex: currentSubject.habituationIndex,
        calvesPresent: currentSubject.calvesPresent,
        calfCount: currentSubject.calfCount,
        biologicalThreatLevel: isRaja ? 'Critical' : (isKumari ? 'Moderate' : 'High')
      },
      agriculture: {
        zoneId: 'ZONE-01',
        deterrentDeployed,
        valveActuated: `SOL-${currentNode.nodeId.slice(-2)}A`,
        valveDurationSec,
        chiliDischargedLiters,
        acousticFrequencyHz,
        tankRemainingLiters: Math.max(380, 480 - (i * 2.8)),
        windBlowbackCheckPassed: true
      },
      outcome,
      cropDamagePreventedUsd: damagePreventedUsd,
      villageEarlyWarningDispatched: true,
      earlyWarningRecipients: [
        { village: 'Habarana North Village', smsSentCount: 164, sirenTriggered: isRaja },
        { village: 'Paluwewa Hamlet', smsSentCount: 88, sirenTriggered: isRaja }
      ],
      executionLatency: {
        t0_optical_thermal_detect_ms: Math.floor(16 + Math.random() * 8),
        t1_edge_yolo_infer_ms: Math.floor(38 + Math.random() * 12),
        t2_mesh_lora_relay_ms: Math.floor(30 + Math.random() * 10),
        t3_vet_biometric_lookup_ms: Math.floor(48 + Math.random() * 18),
        t4_tri_decision_calc_ms: Math.floor(18 + Math.random() * 8),
        t5_agro_valve_solenoid_ms: valveDurationSec > 0 ? Math.floor(45 + Math.random() * 15) : 0,
        totalHandshakeTimeMs: Math.floor(210 + Math.random() * 45)
      },
      chaosTestRun: false
    });
  }
  await BreachIncident.create(incidents);

  // 6. Seed SystemConfig
  console.log('[SEED] Setting up Global System Configuration...');
  await SystemConfig.create({
    key: 'trident_global_config',
    engineeringActive: true,
    veterinaryActive: true,
    agricultureActive: true,
    aiConfidenceThreshold: 85,
    musthAggressionMultiplier: 1.8,
    maxSafeWindSpeedKmh: 25,
    minChiliTankReservePct: 15,
    chiliDischargeDurationSec: 6,
    beeFrequencyBandHz: 380,
    judgeDemoMode: true
  });

  console.log('===========================================================');
  console.log(' [TRIDENT SEED COMPLETE] Tactical Dataset Initialized:     ');
  console.log(' - 4 Tactical Demo Accounts (Judge, Vet, Eng, Agro)        ');
  console.log(' - 12 Perimeter Sector Nodes (NODE-01 to NODE-12)          ');
  console.log(' - 15 Collared Elephant Profiles with Biometrics & Herds   ');
  console.log(' - 6 Agricultural Buffer Zones with Chili & Acoustic Tanks ');
  console.log(' - 25 Historical Breach Incidents with Millisecond Timelines');
  console.log('===========================================================');
};

// If run directly via CLI (npm run seed)
if (require.main === module) {
  connectDB()
    .then(async () => {
      await seedTacticalData();
      process.exit(0);
    })
    .catch((err) => {
      console.error('[SEED FATAL ERROR]', err);
      process.exit(1);
    });
}

module.exports = { seedTacticalData };
