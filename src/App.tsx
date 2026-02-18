import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { ThankYouPage } from './components/ThankYouPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gracias" element={<ThankYouPage />} />
      </Routes>
    </Router>
  );
}

export default App;
