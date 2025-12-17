
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Today } from './pages/Today';
import { OpsDashboard } from './pages/OpsDashboard';
import { CeoDashboard } from './pages/CeoDashboard';
import { InstallerDashboard } from './pages/InstallerDashboard';
import { Assets } from './pages/Assets';
import { Cases } from './pages/Cases';
import { Jobs } from './pages/Jobs';
import { Messages } from './pages/Messages';
import { Settings } from './pages/Settings';
import { DailyReport } from './pages/DailyReport';
import { Exceptions } from './pages/Exceptions';
import { Products } from './pages/Products';
import { SettingsAgents } from './pages/SettingsAgents';

// Care & CRM Pages
import { CareDashboard } from './pages/CareDashboard';
import { CareClients } from './pages/CareClients';
import { ClientProfile } from './pages/ClientProfile';
import { CareOrders } from './pages/CareOrders';
import { CareConfirmations } from './pages/CareConfirmations';
import { CareNewOrder } from './pages/CareNewOrder';
import { NewAssessment } from './pages/NewAssessment';
import { AssessmentReview } from './pages/AssessmentReview';
import { CarePlanReview } from './pages/CarePlanReview';

import { store } from './services/store';

const App: React.FC = () => {
  useEffect(() => {
    store.startAgentLoop();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Landing is now the Root Entry Point */}
          <Route path="/" element={<Landing />} />
          
          {/* Admin / Ops Main View */}
          <Route path="/dashboard" element={<Today />} />
          <Route path="/ops-dashboard" element={<OpsDashboard />} />
          
          {/* Executive */}
          <Route path="/ceo-dashboard" element={<CeoDashboard />} />

          {/* Field Service */}
          <Route path="/installer-dashboard" element={<InstallerDashboard />} />

          {/* Shared Ops Pages */}
          <Route path="/exceptions" element={<Exceptions />} />
          <Route path="/report" element={<DailyReport />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/messages" element={<Messages />} />
          
          {/* Settings Sub-routes */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/agents" element={<SettingsAgents />} />

          {/* Care Company / CRM Routes */}
          <Route path="/care-dashboard" element={<CareDashboard />} />
          <Route path="/clients" element={<CareClients />} />
          <Route path="/clients/:id" element={<ClientProfile />} />
          <Route path="/clients/:id/new-order" element={<CareNewOrder />} />
          
          {/* New Assessment Flow */}
          <Route path="/clients/:id/assessment/new" element={<NewAssessment />} />
          <Route path="/clients/:id/assessment/:assessmentId/review" element={<AssessmentReview />} />
          <Route path="/clients/:id/care-plan/review" element={<CarePlanReview />} />

          <Route path="/orders" element={<CareOrders />} />
          <Route path="/confirmations" element={<CareConfirmations />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
