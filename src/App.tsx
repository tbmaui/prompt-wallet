import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/components/landing/LandingPage';
import { MainApp } from '@/components/MainApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
