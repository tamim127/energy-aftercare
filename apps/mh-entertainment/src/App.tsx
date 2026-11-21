import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@project/components/ui/sonner';
import LandingPage from './pages/LandingPage';
import SubmitProjectPage from './pages/SubmitProjectPage';
import RadioSubmissionPage from './pages/RadioSubmissionPage';
import TVSubmissionPage from './pages/TVSubmissionPage';
import OtherOpportunitiesPage from './pages/OtherOpportunitiesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/submit-project" element={<SubmitProjectPage />} />
        <Route path="/radio-submission" element={<RadioSubmissionPage />} />
        <Route path="/tv-submission" element={<TVSubmissionPage />} />
        <Route path="/other-opportunities" element={<OtherOpportunitiesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
