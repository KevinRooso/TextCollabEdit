import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    navigate("/"); // Navigate to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light header-bg">
      <div className="container">
        <a className="navbar-brand text-white" href="#">TextCollabEdit</a>
        <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Header;
