import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddDocumentPage from "./pages/AddDocumentPage";
import { CssBaseline } from '@mui/material';
import Modal from 'react-modal';
import {Toaster} from 'react-hot-toast';

function App() {
  Modal.setAppElement('#root');
  return (
    <>
      
      <BrowserRouter>        
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/add-document" element={<AddDocumentPage />} /> 
            <Route path="/dashboard/document/:id" element={<AddDocumentPage />} /> 

          </Routes>        
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
