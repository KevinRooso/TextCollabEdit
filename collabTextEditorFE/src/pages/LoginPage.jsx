import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}auth/github`;
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="text-center">
        <h1 className="mb-4">TextCollabEdit</h1>
        <p>Welcome to the platform! Please log in to continue.</p>
        <button className="btn btn-primary" onClick={handleLogin}>Login with GitHub</button>
      </div>
    </div>
  );
};

export default LoginPage;
