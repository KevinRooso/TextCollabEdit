import axiosInstance from "../guards/InterceptorConfig";
import { arrayBufferToBase64, base64ToPem, base64ToPemPrivateKey } from "./HelperService";

export const generateRSAKeyPair = async () => {
    const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
  
    // Export the keys (spki and pkcs8 are standard syntax for pub and private key storage)
    const exportedPublicKey = await window.crypto.subtle.exportKey("spki", publicKey);
    const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  
    return { publicKey: exportedPublicKey, privateKey: exportedPrivateKey };
};

export const savePrivateKey = (privateKey) => {    
    const base64PrivateKey = arrayBufferToBase64(privateKey);
    const pemPrivateKey = base64ToPemPrivateKey(base64PrivateKey); 

    const blob = new Blob([pemPrivateKey], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "textcollabedit-private-key.pem";
    link.click();

    // Save private key in localStorage
    localStorage.setItem("privateKey", pemPrivateKey); 
}

export const createGist = async(accessToken,publicKey) => {
  // Convert the ArrayBuffer public key to Base64
  const base64PublicKey = arrayBufferToBase64(publicKey);

  // Convert Base64 to PEM format for better readability
  const pemPublicKey = base64ToPem(base64PublicKey);

    const gistData = {
        description: "RSA Public Key for user verification",
        public: true,
        files: {
          "textcollabedit-public-key.txt": {
            content: pemPublicKey,
          },
        },
      };
    
      try {
        const response = await fetch("https://api.github.com/gists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gistData),
        });
    
        const data = await response.json();
        if (data.id) {
            const gistUrl = data.html_url;
            return gistUrl;
        }
      } catch (error) {
        console.error("Error creating gist:", error);
      }
}

// Update in Database
export const updateUser = (userId, publicKey, gistUrl) => {
    try{
        const base64PublicKey = arrayBufferToBase64(publicKey);
        const pemPublicKey = base64ToPem(base64PublicKey);
        let body = {
            "publicKey": pemPublicKey,
            "gistUrl": gistUrl,
            "authenticated": true
        }
        const response = axiosInstance.put(`/api/user/${userId}`, body);
        if (response.success) {
            console.log("User updated successfully!");
        }
    }catch(error){
        console.error("Error updating user:", error);
    }
}

export const getUserDetails = async(userId) => {
    try{
        const response = await axiosInstance.get(`/api/user/${userId}`);
        const userDetails = response.data;
        return userDetails
    }catch(error){
        console.error("Error getting user details:", error);
    }
      
}

export const getAllUsers = async() => {
   try{
        const response = await axiosInstance.get(`/api/users`);
        const users = response.data;
        return users
    }catch(error){
        console.error("Error getting user details:", error);
    }
}

