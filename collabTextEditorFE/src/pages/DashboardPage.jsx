import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/Header'; // Import the Header component
import { createGist, generateRSAKeyPair, getUserDetails, savePrivateKey, updateUser } from "../services/AuthService";
import DocumentsList from "../components/DocumentList";
import PrivateKeyModal from '../components/PrivateKeyModal';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user,setUser] = useState(null);  
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);  // Flag to show private key modal

  useEffect(() => {
    if(localStorage.getItem("token")){
      setLoggedIn(true); 
      checkPrivateKey();  // Check for private key on load     
    }else{
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
    }    
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
      checkPrivateKey(); 
    }
  }

  // Check if private key exists in local storage
  const checkPrivateKey = () => {
    const key = localStorage.getItem('privateKey');
    if (!key) {
      setShowPrivateKeyModal(true);  // Show modal if private key is not found
    }
  };

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

  // Navigate to the add document page
  const handleAddDocument = () => {
    navigate('/dashboard/add-document');
  };

  const handleSavePrivateKey = (key) => {    
    setShowPrivateKeyModal(false);  // Close the modal
  };

  return (
    <div className="container=fluid">      
      <Header />

      <div className="mt-3 mx-3">
        {loggedIn ? (
          <>          
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mt-2">Your Documents</h3>
            <button className="btn btn-primary" onClick={handleAddDocument}>
              Add New Document
          </button>
          </div>
          
          <DocumentsList userId={user?._id} />
          </>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
      {/* Private key modal */}
      <PrivateKeyModal
        isOpen={showPrivateKeyModal}
        onRequestClose={() => setShowPrivateKeyModal(false)}
        onSave={handleSavePrivateKey}
      />
    </div>
  );
};

export default DashboardPage;
