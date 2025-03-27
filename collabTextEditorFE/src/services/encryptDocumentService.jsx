import { arrayBufferToBase64, pemToArrayBuffer } from "./HelperService";
import axios from "axios";

// Generate AES key and IV for the document
export const generateAESKeyAndIV = async () => {
    const aesKey = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,  // 256-bit AES key
      },
      true,
      ['encrypt', 'decrypt']
    );
  
    const iv = window.crypto.getRandomValues(new Uint8Array(12));  // Generate a random 12-byte IV for AES-GCM
    return { aesKey, iv };
};

// Encrypt AES Key with user RSA public key 
export const encryptAESKeyWithRSA = async (gistUrl, aesKey) => {

    const publicKeyPem = await verifyAndGetRSAPublicKey(gistUrl);
    const publicKey = pemToArrayBuffer(publicKeyPem,'public');

    // Converts the array buffer to Crypto Key object
    const importedPublicKey = await window.crypto.subtle.importKey(
      'spki',
      publicKey,  // The public key of the collaborator converted back to Array buffer
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      ['encrypt']
    );

    // Export the AES key as an ArrayBuffer before encryption
    const aesKeyArrayBuffer = await window.crypto.subtle.exportKey('raw', aesKey);
  
    // The array buffer aes key is encrypted with RSA pub key in Crypto key format
    const encryptedKey = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      importedPublicKey,
      aesKeyArrayBuffer
    );
  
    return arrayBufferToBase64(encryptedKey);  // Convert to Base64 for exchange
};

// Encrypt the content using AES
export const encryptContentWithAES = async (content, aesKey, iv) => {
    const encoder = new TextEncoder();
    const contentBuffer = encoder.encode(content);
    
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,  // Same IV used for all collaborators
      },
      aesKey,
      contentBuffer
    );
  
    return arrayBufferToBase64(encryptedContent);  // Convert encrypted content to Base64 for storage
};

// Function to fetch RSA public key from GitHub Gist URL and verify
export const verifyAndGetRSAPublicKey = async (gistUrl) => {
    try {
      // Proxy Url due to React Cors issue with gist
      const proxyUrl = `/gist/${gistUrl.split('https://gist.github.com/')[1]}/raw/textcollabedit-public-key.txt`;
      // Gist Data in raw format
      const gistData = await axios.get(proxyUrl);
      const publicKeyContent = gistData.data;
      // Extract the public key content from the Gist      
      if (!publicKeyContent) {
        throw new Error('Public key not found in the Gist');
      }
  
      // Here we would potentially validate the key format or content further, if needed.
      return publicKeyContent;  // Return the public key content
    } catch (error) {
      console.error('Error fetching RSA public key from Gist:', error);
      throw new Error('Invalid Gist URL or public key missing');
    }
};
