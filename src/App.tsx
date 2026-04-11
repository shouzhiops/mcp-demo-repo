import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MobileApp from './pages/mobile/MobileApp';
import AdminApp from './pages/admin/AdminApp';
import ScreenApp from './pages/screen/ScreenApp';
import Login from './pages/Login';
import Register from './pages/Register';
import { useStore } from './store';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = useStore((state) => state.token);
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/mobile/*" element={<PrivateRoute><MobileApp /></PrivateRoute>} />
        <Route path="/admin/*" element={<PrivateRoute><AdminApp /></PrivateRoute>} />
        <Route path="/screen/*" element={<PrivateRoute><ScreenApp /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
