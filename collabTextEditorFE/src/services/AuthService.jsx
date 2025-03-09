import axiosInstance from "../guards/InterceptorConfig";

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
  
    // Export the keys
    const exportedPublicKey = await window.crypto.subtle.exportKey("spki", publicKey);
    const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  
    return { publicKey: exportedPublicKey, privateKey: exportedPrivateKey };
};

export const savePrivateKey = (privateKey) => {
    const keyArray = new Uint8Array(privateKey)
    const blob = new Blob([keyArray], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "textcollabedit-private-key.txt";
    link.click();
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
        if (response.data.success) {
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

// RSA keys are generated in Array Buffer, convert to readable Base64 format
const arrayBufferToBase64 = (arrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const length = bytes.byteLength;
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

// Convert Base64 to PEM format 
export const base64ToPem = (base64Key) => {
    const pemHeader = "-----BEGIN PUBLIC KEY-----\n";
    const pemFooter = "\n-----END PUBLIC KEY-----";
    const key = base64Key.match(/.{1,64}/g).join("\n"); // Split into lines of 64 characters
    return pemHeader + key + pemFooter;
};