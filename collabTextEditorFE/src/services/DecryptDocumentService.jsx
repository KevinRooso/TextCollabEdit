import {base64ToArrayBuffer, pemToArrayBuffer } from "./HelperService";

//Decrypt AES key with RSA
const decryptAESKeyWithRSA = async (encryptedAESKey, privateKey) => {
  // PEM to array buffer format
  const privateKeyArrayBuffer = pemToArrayBuffer(privateKey,'private');

  // Array buffer format to CryptoKey object
  const importedPrivateKey = await window.crypto.subtle.importKey(
    'pkcs8',
    privateKeyArrayBuffer, 
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['decrypt']
  );

  //Encrypted AES key (from Base64) back to ArrayBuffer
  const encryptedAESKeyArrayBuffer = base64ToArrayBuffer(encryptedAESKey);

  // Decrypt AES key using the private key
  const decryptedAESKeyBuffer = await window.crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    importedPrivateKey,
    encryptedAESKeyArrayBuffer
  );

  // AES key converted from array buffer to CryptoKey object
  const aesKey = await window.crypto.subtle.importKey(
    'raw',
    decryptedAESKeyBuffer, // Decrypted AES key buffer
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );

  return aesKey;
};

// Decrypt the content using AES Key
const decryptContentWithAES = async (encryptedContent, aesKey, iv) => {
  const decoder = new TextDecoder();
  // Encrypted Content converted from Base64 to Array Buffer
  const encryptedContentBuffer = base64ToArrayBuffer(encryptedContent);

  const decryptedContentBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,  // Same IV used for encryption
    },
    aesKey,
    encryptedContentBuffer
  );

  const decryptedContent = decoder.decode(decryptedContentBuffer);
  return decryptedContent;
};

// Decrypt Aes key and IV together (also used in updating document)
export const getAesKeyIv = async(documentDetails,privateKey,currentUserId) => {
    try {
        let encryptedAESKey;
        let iv;
    
        // Find the encrypted AES key based on the user (owner or collaborator)
        if (documentDetails.owner === currentUserId) {
          encryptedAESKey = documentDetails.encryptedOwnerAESKey;
        } else {
          const collaborator = documentDetails.collaborators.find(
            (collaborator) => collaborator.userId === currentUserId
          );
          if (collaborator) {
            encryptedAESKey = collaborator.encryptedAESKey;
          } else {
            throw new Error('User is neither the owner nor a collaborator');
          }
        }
    
        // Decrypt the AES key using the private key
        const aesKey = await decryptAESKeyWithRSA(encryptedAESKey, privateKey);
    
        // Convert IV from Base64 back to ArrayBuffer
        iv = base64ToArrayBuffer(documentDetails.iv);
    
        return {aesKey, iv}
    }catch (error) {
        console.error('Error decrypting Aes key and IV:', error);
        throw new Error('Failed to decrypt document content');
    }
}

// Main function to decrypt the document content
export const decryptDocumentContent = async (documentDetails, privateKey, currentUserId) => {
  try {
    const {aesKey, iv} = await getAesKeyIv(documentDetails,privateKey,currentUserId)
    // Decrypt the content using the AES key
    const decryptedContent = await decryptContentWithAES(documentDetails.content, aesKey, iv);

    return decryptedContent;
  } catch (error) {
    console.error('Error decrypting document content:', error);
    throw new Error('Failed to decrypt document content');
  }
};