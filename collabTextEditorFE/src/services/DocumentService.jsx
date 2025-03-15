import axiosInstance from "../guards/InterceptorConfig";
import { getUserDetails } from "./AuthService";
import { getAesKeyIv } from "./DecryptDocumentService";
import { encryptAESKeyWithRSA, encryptContentWithAES, generateAESKeyAndIV } from "./encryptDocumentService";
import { arrayBufferToBase64, base64ToArrayBuffer, pemToArrayBuffer } from "./HelperService";
import axios from "axios";

// Function to create a new document
export const createDocument = async (title, content, owner, collaboratorIds) => {
  try {
    // Generate AES key and IV for the document
    const { aesKey, iv } = await generateAESKeyAndIV();

    // Encrypt the content using AES
    const encryptedContent = await encryptContentWithAES(content, aesKey, iv);

    // Encrypt the content with owner Pub key first
    const encryptedOwnerAESKey = await encryptAESKeyWithRSA(owner.gistUrl, aesKey);

    // Encrypt AES key for each collaborator using their RSA public key
    const encryptedAESKeysPromises = collaboratorIds.map(async (collaboratorId) => {
      const collaborator = await getUserDetails(collaboratorId); // Get the collaborator details (including publicKey)
      const encryptedAESKey = await encryptAESKeyWithRSA(collaborator.gistUrl, aesKey);
      return {
        userId: collaboratorId,
        encryptedAESKey: encryptedAESKey,
      };
    });

    const encryptedAESKeys = await Promise.all(encryptedAESKeysPromises);

    // Send document creation request to the backend
    const response = await axiosInstance.post('/api/documents', {
      title,
      content: encryptedContent,  // Encrypted content
      ownerId: owner._id,
      collaborators: encryptedAESKeys,  // Array of { userId, encryptedAESKey }
      encryptedOwnerAESKey: encryptedOwnerAESKey, // Owner Aes key encrypted
      iv: arrayBufferToBase64(iv),  // Include IV as Base64
    });

    return response.data;
  } catch (error) {
    console.error('Error creating document:', error);
  }
};


// Document Listing Fetch
export const fetchDocumentList = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/documents/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching document list:", error);
  }
};

// Fetch Document Details By Id
export const fetchDocumentDetails = async (docId) => {
  try {
    const response = await axiosInstance.get(`/api/document/${docId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching document details:", error);
  }
};

// Update Document Content
export const updateDocumentContent = async (documentDetails,privateKey,currentUserId,content) => {
  try {
    // Decrypt the AES key and IV from document details
    const {aesKey, iv} = await getAesKeyIv(documentDetails,privateKey,currentUserId);
    // Encrypt the content using AES
    const encryptedContent = await encryptContentWithAES(content, aesKey, iv);
    // Update Document Content API
    const response = await axiosInstance.put(`/api/document/${documentDetails._id}/content`,{
      content: encryptedContent
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching document details:", error);
  }
}