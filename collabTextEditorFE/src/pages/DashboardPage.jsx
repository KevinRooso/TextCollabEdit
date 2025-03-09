import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/Header'; // Import the Header component
import { createGist, generateRSAKeyPair, getUserDetails, savePrivateKey, updateUser } from "../services/AuthService";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user,setUser] = useState(null);  

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userFromParams = JSON.parse(urlParams.get("user"));  
    const accessToken = urlParams.get("accessToken");    

    if (!accessToken || !userFromParams) {
      navigate("/");
      return;
    }

    localStorage.setItem("token", accessToken);   
    setLoggedIn(true);
    getUser(userFromParams,accessToken);
  }, []);

  const getUser = async(userFromParams,accessToken) =>{
    if(user){
      return
    }
    // Gets user details
    const userDetails = await getUserDetails(userFromParams.id)
    // Generate Key pair if not in DB (First sign up)
    if(!userDetails.publicKey){
      handleNewUser(userFromParams,accessToken)
    }else{
      setUser(userDetails)
      localStorage.setItem("user", JSON.stringify(userDetails)); 
    }
  }

  const handleNewUser = async(user,accessToken) => {    
    // Generate RSA Key Pair
    const { publicKey, privateKey } = await generateRSAKeyPair();    
    
    // Save Private Key
    savePrivateKey(privateKey)

    // Post Public Key to Github Gist
    const gistUrl = await createGist(accessToken,publicKey)

    // Upload GistUrl and Public key to DB
    await updateUser(user.id,publicKey,gistUrl)
    
    // Get User Details 
    const userDetails = await getUserDetails(user.id)            
    setUser(userDetails); 
    localStorage.setItem("user", JSON.stringify(userDetails));    
  }

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
