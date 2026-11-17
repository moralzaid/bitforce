/**
 * TRIDENT In-Memory Tactical Store & Model Fallback Provider
 * Ensures zero-dependency, turnkey boot even when external MongoDB services are unavailable.
 */

// Initial Seed Constants
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

const initialNodes = Array.from({ length: 12 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  const baseLat = 6.8219;
  const baseLng = 80.9982;
  const lat = Number((baseLat + (i * 0.008) + ((i % 2 === 0 ? 1 : -1) * 0.002)).toFixed(4));
  const lng = Number((baseLng + (i * 0.009) + ((i % 3 === 0 ? 1 : -1) * 0.003)).toFixed(4));

  return {
    _id: `node_id_${num}`,
    nodeId: `NODE-${num}`,
    sectorName: sectorNames[i],
    coordinates: { latitude: lat, longitude: lng },
    solarBatteryLevel: i === 3 ? 98 : Math.floor(84 + Math.random() * 14),
    pvChargingState: i % 4 === 0 ? 'Bulk Charging' : 'Float',
    aiEdgeStatus: 'Online',
    aiConfidenceThreshold: 85,
    solenoidValveIds: [`SOL-${num}A`, `SOL-${num}B`],
    acousticArrayIds: [`SPK-${num}-NORTH`, `SPK-${num}-SOUTH`],
    latencyMs: Math.floor(34 + Math.random() * 15),
    loraRssiDbm: -Math.floor(62 + Math.random() * 12),
    meshHopCount: i < 4 ? 1 : (i < 8 ? 2 : 3),
    hardwareStatus: 'Nominal',
    lastPing: new Date()
  };
});

const initialElephants = [
  {
    _id: 'el_001',
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
    bioNotes: 'Dominant breeding tusker in peak Musth. Copious temporal drainage, extreme testosterone surge, history of breaking unpressurized fences.',
    hormoneHistory: [
      { timestamp: new Date(Date.now() - 42 * 86400000), testosteroneIndex: 68, aggressionScore: 7.2, musthStatus: 'Pre-Musth' },
      { timestamp: new Date(Date.now() - 28 * 86400000), testosteroneIndex: 82, aggressionScore: 8.4, musthStatus: 'Active' },
      { timestamp: new Date(Date.now() - 14 * 86400000), testosteroneIndex: 94, aggressionScore: 9.2, musthStatus: 'Active' },
      { timestamp: new Date(), testosteroneIndex: 96, aggressionScore: 9.4, musthStatus: 'Active' }
    ]
  },
  {
    _id: 'el_002',
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
    bioNotes: 'Experienced herd leader accompanied by 3 nursing calves (ages 4 mo - 2 yrs). High maternal protective instincts; chemical mist strictly forbidden.',
    hormoneHistory: [
      { timestamp: new Date(Date.now() - 28 * 86400000), testosteroneIndex: 8, aggressionScore: 2.4, musthStatus: 'N/A - Female' },
      { timestamp: new Date(), testosteroneIndex: 8, aggressionScore: 2.4, musthStatus: 'N/A - Female' }
    ]
  },
  {
    _id: 'el_003',
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
    bioNotes: 'Highly intelligent crop-raider habituated to single-tone acoustic alarms. Requires modulated bee swarm frequencies paired with dynamic micro-pulses.',
    hormoneHistory: [
      { timestamp: new Date(Date.now() - 28 * 86400000), testosteroneIndex: 55, aggressionScore: 6.8, musthStatus: 'Pre-Musth' },
      { timestamp: new Date(), testosteroneIndex: 64, aggressionScore: 7.8, musthStatus: 'Pre-Musth' }
    ]
  },
  {
    _id: 'el_004',
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
    _id: 'el_005',
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
    _id: 'el_006',
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
    _id: 'el_007',
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
    _id: 'el_008',
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
    _id: 'el_009',
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
    _id: 'el_013',
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
  }
];

const initialAgroZones = [
  {
    _id: 'zone_01',
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
    _id: 'zone_02',
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
    _id: 'zone_03',
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
    _id: 'zone_04',
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
    _id: 'zone_05',
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
    _id: 'zone_06',
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

const initialIncidents = Array.from({ length: 25 }, (_, i) => {
  const isRaja = i % 3 === 0;
  const isKumari = i % 3 === 1;
  const currentName = isRaja ? 'Raja (Apex Bull)' : isKumari ? 'Kumari Matriarch & Herd' : 'Gaja (Habituated Raider)';
  const collarId = isRaja ? 'EL-001' : isKumari ? 'EL-002' : 'EL-003';
  const nodeIdx = (i * 3) % 12;
  const node = initialNodes[nodeIdx];
  const timestamp = new Date(Date.now() - (26 - i) * 18 * 60 * 60 * 1000);

  let outcome = 'Deterred - Retreated to Sanctuary Buffer';
  let deterrent = 'Dual_Acoustic_Chili_Pulse_Tier2';
  let chili = 3.5;
  let valveDur = 4;
  let hz = 380;
  let saved = 3400;

  if (isRaja) {
    outcome = 'Violent Charge Halted by Chili Curtain';
    deterrent = 'High_Pressure_Chili_Curtain_Tier3';
    chili = 8.5;
    valveDur = 8;
    hz = 520;
    saved = 9200;
  } else if (isKumari) {
    outcome = 'Herd Redirected - Calves Protected';
    deterrent = 'Acoustic_Bee_Swarm_Tier1';
    chili = 0;
    valveDur = 0;
    hz = 340;
    saved = 4800;
  }

  return {
    _id: `inc_id_${i + 1}`,
    incidentCode: `INC-${202600 + i + 1}`,
    timestamp,
    nodeId: node.nodeId,
    sectorName: node.sectorName,
    coordinates: node.coordinates,
    elephantName: currentName,
    collarId,
    subjectType: 'Elephant',
    engineering: {
      aiConfidence: Number((96.4 + (i % 3) * 0.8).toFixed(1)),
      opticalTrigger: true,
      thermalDeltaC: 5.2,
      networkLatencyMs: 42,
      solarLevel: node.solarBatteryLevel
    },
    veterinary: {
      musthStatus: isRaja ? 'Active' : isKumari ? 'N/A - Female' : 'Pre-Musth',
      biologicalThreatLevel: isRaja ? 'Critical' : isKumari ? 'Moderate' : 'High',
      aggressionScore: isRaja ? 9.4 : isKumari ? 2.4 : 7.8,
      calvesPresent: isKumari,
      calfCount: isKumari ? 3 : 0
    },
    agriculture: {
      zoneId: 'ZONE-01',
      deterrentDeployed: deterrent,
      valveActuated: `SOL-${node.nodeId.slice(-2)}A`,
      valveDurationSec: valveDur,
      chiliDischargedLiters: chili,
      acousticFrequencyHz: hz,
      tankRemainingLiters: Math.max(380, 480 - i * 2.8),
      windBlowbackCheckPassed: true
    },
    outcome,
    cropDamagePreventedUsd: saved,
    villageEarlyWarningDispatched: true,
    executionLatency: {
      t0_optical_thermal_detect_ms: 18,
      t1_edge_yolo_infer_ms: 42,
      t2_mesh_lora_relay_ms: 36,
      t3_vet_biometric_lookup_ms: 58,
      t4_tri_decision_calc_ms: 22,
      t5_agro_valve_solenoid_ms: valveDur > 0 ? 54 : 12,
      totalHandshakeTimeMs: 230
    },
    chaosTestRun: false
  };
});

// Tactical Store In-Memory State
class TacticalStore {
  constructor() {
    this.nodes = [...initialNodes];
    this.elephants = [...initialElephants];
    this.agroZones = [...initialAgroZones];
    this.incidents = [...initialIncidents];
    this.config = {
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
    };
  }

  // Elephants
  getElephants(filter = {}) {
    return this.elephants.filter((e) => {
      if (filter.musthStatus && filter.musthStatus !== 'ALL' && e.musthStatus !== filter.musthStatus) return false;
      if (filter.classification && filter.classification !== 'ALL' && e.classification !== filter.classification) return false;
      if (filter.minAggression && e.aggressionScore < Number(filter.minAggression)) return false;
      if (filter.search) {
        const s = filter.search.toLowerCase();
        return (
          e.name.toLowerCase().includes(s) ||
          e.collarId.toLowerCase().includes(s) ||
          (e.bioNotes && e.bioNotes.toLowerCase().includes(s))
        );
      }
      return true;
    });
  }

  getElephantById(id) {
    return this.elephants.find((e) => e._id === id || e.collarId === id);
  }

  createElephant(data) {
    const newEl = {
      ...data,
      _id: `el_${Date.now()}`,
      breachCount: 0,
      hormoneHistory: [
        {
          timestamp: new Date(),
          testosteroneIndex: data.testosteroneIndex || 40,
          aggressionScore: data.aggressionScore || 5,
          musthStatus: data.musthStatus || 'Pre-Musth'
        }
      ]
    };
    this.elephants.unshift(newEl);
    return newEl;
  }

  updateElephant(id, data) {
    const idx = this.elephants.findIndex((e) => e._id === id || e.collarId === id);
    if (idx === -1) return null;
    this.elephants[idx] = { ...this.elephants[idx], ...data };
    return this.elephants[idx];
  }

  // Nodes
  getNodes() {
    return this.nodes;
  }

  getNodeById(id) {
    return this.nodes.find((n) => n._id === id || n.nodeId === id);
  }

  updateNode(id, data) {
    const idx = this.nodes.findIndex((n) => n._id === id || n.nodeId === id);
    if (idx === -1) return null;
    this.nodes[idx] = { ...this.nodes[idx], ...data, lastPing: new Date() };
    return this.nodes[idx];
  }

  // Agro Zones
  getAgroZones() {
    return this.agroZones;
  }

  getAgroZoneById(id) {
    return this.agroZones.find((z) => z._id === id || z.zoneId === id);
  }

  updateAgroZone(id, data) {
    const idx = this.agroZones.findIndex((z) => z._id === id || z.zoneId === id);
    if (idx === -1) return null;
    this.agroZones[idx] = { ...this.agroZones[idx], ...data };
    return this.agroZones[idx];
  }

  // Incidents
  getIncidents(filter = {}) {
    return this.incidents.filter((inc) => {
      if (filter.outcome && filter.outcome !== 'ALL' && !inc.outcome.toLowerCase().includes(filter.outcome.toLowerCase())) return false;
      if (filter.subjectType && filter.subjectType !== 'ALL' && inc.subjectType !== filter.subjectType) return false;
      if (filter.nodeId && filter.nodeId !== 'ALL' && inc.nodeId !== filter.nodeId) return false;
      if (filter.search) {
        const s = filter.search.toLowerCase();
        return (
          inc.incidentCode.toLowerCase().includes(s) ||
          inc.elephantName.toLowerCase().includes(s) ||
          inc.sectorName.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }

  getIncidentById(id) {
    return this.incidents.find((inc) => inc._id === id || inc.incidentCode === id);
  }

  addIncident(data) {
    const inc = {
      ...data,
      _id: `inc_${Date.now()}`
    };
    this.incidents.unshift(inc);
    return inc;
  }

  reset() {
    this.nodes = [...initialNodes];
    this.agroZones = [...initialAgroZones];
    this.config = {
      ...this.config,
      engineeringActive: true,
      veterinaryActive: true,
      agricultureActive: true
    };
  }
}

const tacticalStore = new TacticalStore();

module.exports = tacticalStore;
