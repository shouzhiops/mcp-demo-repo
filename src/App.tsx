import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MobileApp from './pages/mobile/MobileApp';
import AdminApp from './pages/admin/AdminApp';
import ScreenApp from './pages/screen/ScreenApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/mobile/*" element={<MobileApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/screen/*" element={<ScreenApp />} />
      </Routes>
    </Router>
  );
}

export default App;
