import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SimulationProvider } from './context/SimulationContext';

import TacticalLayout from './layouts/TacticalLayout';
import LiveCommandCenter from './pages/LiveCommandCenter';
import BreachSimulator from './pages/BreachSimulator';
import ChaosLabPage from './pages/ChaosLabPage';
import PerimeterSectorMapPage from './pages/PerimeterSectorMapPage';
import EngineeringHubPage from './pages/EngineeringHubPage';
import VeterinaryRegistryPage from './pages/VeterinaryRegistryPage';
import ElephantDetailPage from './pages/ElephantDetailPage';
import AgriculturalControlPage from './pages/AgriculturalControlPage';
import IncidentHistoryPage from './pages/IncidentHistoryPage';
import IncidentPostMortemPage from './pages/IncidentPostMortemPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import VillageBroadcastPage from './pages/VillageBroadcastPage';
import SystemArchitecturePage from './pages/SystemArchitecturePage';
import SystemSettingsPage from './pages/SystemSettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SimulationProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Tactical Command Layout Routes */}
            <Route element={<TacticalLayout />}>
              <Route path="/" element={<LiveCommandCenter />} />
              <Route path="/breach-simulator" element={<BreachSimulator />} />
              <Route path="/chaos-lab" element={<ChaosLabPage />} />
              <Route path="/perimeter-map" element={<PerimeterSectorMapPage />} />
              <Route path="/engineering" element={<EngineeringHubPage />} />
              <Route path="/veterinary" element={<VeterinaryRegistryPage />} />
              <Route path="/veterinary/:id" element={<ElephantDetailPage />} />
              <Route path="/agriculture" element={<AgriculturalControlPage />} />
              <Route path="/incidents" element={<IncidentHistoryPage />} />
              <Route path="/incidents/:id" element={<IncidentPostMortemPage />} />
              <Route path="/analytics" element={<AnalyticsDashboardPage />} />
              <Route path="/village-broadcast" element={<VillageBroadcastPage />} />
              <Route path="/architecture" element={<SystemArchitecturePage />} />
              <Route path="/settings" element={<SystemSettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </SimulationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
