import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/Header'; // Import the Header component

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get("user");
    const accessToken = urlParams.get("accessToken");    

    if (!accessToken || !refreshToken || !user) {
      navigate("/");
      return;
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", user);
    setLoggedIn(true);
  }, [navigate]);

  return (
    <div className="container=fluid">      
      <Header />

      <div className="text-center mt-5">
        {loggedIn ? (
          <h2>Welcome to your dashboard!</h2>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
