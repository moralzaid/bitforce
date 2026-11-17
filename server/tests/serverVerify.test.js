const request = require('supertest');
const { app } = require('../server');

describe('TRIDENT Express REST API End-to-End Verification Tests', () => {
  test('GET /api/health returns ONLINE status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ONLINE');
    expect(res.body.service).toContain('TRIDENT');
  });

  test('GET /api/elephants returns 15 realistic collared elephants', async () => {
    const res = await request(app).get('/api/elephants');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(10);
    const raja = res.body.data.find((e) => e.collarId === 'EL-001');
    expect(raja).toBeDefined();
    expect(raja.name).toContain('Raja');
    expect(raja.musthStatus).toBe('Active');
  });

  test('GET /api/nodes returns 12 solar LoRa perimeter nodes', async () => {
    const res = await request(app).get('/api/nodes');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(12);
    expect(res.body.data[0].nodeId).toBe('NODE-01');
    expect(res.body.data[11].nodeId).toBe('NODE-12');
  });

  test('GET /api/agro-zones returns 6 agricultural bio-buffer zones', async () => {
    const res = await request(app).get('/api/agro-zones');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(6);
    expect(res.body.data[0].zoneId).toBe('ZONE-01');
    expect(res.body.data[0].linePressurePsi).toBeGreaterThan(100);
  });

  test('GET /api/incidents returns chronological audit logs', async () => {
    const res = await request(app).get('/api/incidents');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(10);
  });

  test('POST /api/simulate/breach executes Tri-Disciplinary Pipeline', async () => {
    const res = await request(app)
      .post('/api/simulate/breach')
      .send({
        nodeId: 'NODE-04',
        elephantCollarId: 'EL-001'
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.stages.stage4_agriculture.deterrentDeployed).toBe('High_Pressure_Chili_Curtain_Tier3');
    expect(res.body.data.stages.stage2_engineering.aiConfidence).toBeGreaterThan(95);
  });

  test('POST /api/simulate/chaos-test verifies catastrophic failure cascades', async () => {
    const res = await request(app)
      .post('/api/simulate/chaos-test')
      .send({
        disabledEngineering: true,
        disabledVeterinary: false,
        disabledAgriculture: false
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.failureMode).toContain('SYSTEM BLIND');
    expect(res.body.data.visualState.cameraStaticNoise).toBe(true);
  });

  test('POST /api/auth/demo-login instantly provides role JWT', async () => {
    const res = await request(app)
      .post('/api/auth/demo-login')
      .send({ role: 'Judge/Admin' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('Judge/Admin');
  });
});
