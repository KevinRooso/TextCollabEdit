import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <>
      
      <BrowserRouter>        
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>        
      </BrowserRouter>
    </>
  );
}

export default App;
