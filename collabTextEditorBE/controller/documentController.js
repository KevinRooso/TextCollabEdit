const Document = require('../models/document');

const createDocument = async (req, res) => {
    const { title, content, ownerId, collaborators,encryptedOwnerAESKey, iv } = req.body;
  
    try {
      // Create the document and save to the database
      const newDocument = new Document({
        title,
        content, // Encrypted content sent from client
        owner: ownerId,
        collaborators, // Array of { userId, encryptedAESKey } for each collaborator
        encryptedOwnerAESKey,
        iv, // IV sent from client
      });
  
      await newDocument.save();
      res.status(200).json({ success: true, document: newDocument });
    } catch (error) {
      res.status(500).json({ message: 'Error creating document', error });
    }
};

// Function to get the list of documents for a user (as owner or collaborator)
const getDocumentList = async (req, res) => {
  const { userId } = req.params; // userId from URL parameter

  try {
    // Fetch documents where the user is either the owner or a collaborator
    const documents = await Document.find({
      $or: [
        { owner: userId }, // Documents where the user is the owner
        { 'collaborators.userId': userId }, // Documents where the user is a collaborator
      ],
    });

    res.status(200).json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error });
  }
};

// Function to get details of a specific document
const getDocument = async (req, res) => {
  const { documentId } = req.params; // documentId from URL parameter

  try {
    // Fetch document by its ID
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.status(200).json({ success: true, document });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document details', error });
  }
};

const updateDocumentContent = async (req, res) => {
  const { documentId } = req.params;  // Document ID from URL parameter
  const { content } = req.body;  // Content and IV data to update

  try {
    // Find the document by its ID
    const document = await Document.findById(documentId);

    // Check if the document exists
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Update only the content and updated date
    document.content = content || document.content;  // Update content if provided    
    document.updatedAt = Date.now();  // Update the updatedAt field

    // Save the updated document
    await document.save();

    // Return the updated document
    res.status(200).json({ success: true, document });
  } catch (error) {
    res.status(500).json({ message: 'Error updating document content', error });
  }
};

// Function to update both the content and collaborators
const updateDocumentContentAndCollaborators = async (req, res) => {
  const { documentId } = req.params;  // Document ID from URL parameter
  const { content, collaborators } = req.body;  // Content, collaborators, and iv data to update

  try {
    // Find the document by its ID
    const document = await Document.findById(documentId);

    // Check if the document exists
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Update the fields (content, collaborators, and IV)
    document.content = content || document.content;  // Update content if provided
    document.collaborators = collaborators || document.collaborators;  // Update collaborators if provided    
    document.updatedAt = Date.now();  // Update the updatedAt field

    // Save the updated document
    await document.save();

    // Return the updated document
    res.status(200).json({ success: true, document });
  } catch (error) {
    res.status(500).json({ message: 'Error updating document', error });
  }
};

module.exports = { createDocument, getDocumentList, getDocument,updateDocumentContent,updateDocumentContentAndCollaborators };