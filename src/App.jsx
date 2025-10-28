import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { SolutionsProjectsPage } from './pages/SolutionsProjectsPage';
import { TransformationPlanningPage } from './pages/TransformationPlanningPage';
import { TransformationPlanningDetailPage } from './pages/TransformationPlanningDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/solutions-projects" element={<SolutionsProjectsPage />} />
            <Route path="/transformation-planning" element={<TransformationPlanningPage />} />
            <Route path="/transformation-planning/:id" element={<TransformationPlanningDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
