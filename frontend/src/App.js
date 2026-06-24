import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Estimation from './pages/Estimation';
import Assignments from './pages/Assignments';
import Tasks from './pages/Tasks';
import TimeTracking from './pages/TimeTracking';
import Performance from './pages/Performance';
import Reports from './pages/Reports';

function App() {
  const token = localStorage.getItem('token');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={token ? <Navigate to="/projects" /> : <Navigate to="/login" />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id/estimation" element={<Estimation />} />
        <Route path="/projects/:id/assignments" element={<Assignments />} />
        <Route path="/projects/:id/tasks" element={<Tasks />} />
        <Route path="/projects/:id/tracking" element={<TimeTracking />} />
        <Route path="/projects/:id/performance" element={<Performance />} />
        <Route path="/projects/:id/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;