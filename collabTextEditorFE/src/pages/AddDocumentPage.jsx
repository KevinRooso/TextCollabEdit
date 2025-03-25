import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createDocument, fetchDocumentDetails, updateDocumentContent } from "../services/DocumentService";
import {decryptDocumentContent} from "../services/DecryptDocumentService";
import { getAllUsers, getUserDetails } from "../services/AuthService";
import Modal from 'react-modal'; // Modal component from the library
import Header from "../components/Header"; // Import the Header component

import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '300px',
    padding: '20px',
  },
};

const AddDocumentPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [allUsers, setAllUsers] = useState([]); // User List
  const [collaboratorList, setCollaboratorList] = useState([]);  // Collaborator List
  const [showModal, setShowModal] = useState(false);  // To toggle the collaborator modal  
  const [currentUser, setUser] = useState(null);  
  const [privateKey, setPrivateKey] = useState(null);

  //Edit Document Page
  const [document, setDocument] = useState(null);
  const {id} = useParams();  

  useEffect(() => {   
    fetchUserList();

    // If Document Exist fetch details
    if (id) {      
      fetchDocDetails(id);
    }
  },[]);

  // Fetch all users to display as potential collaborators
  const fetchUserList = async () => {
    try {      
      // Current User
      const currUser = JSON.parse(localStorage.getItem("user"));
      // All Users
      const users = await getAllUsers();
      // Remove the current user
      const updatedUsers = users.filter(user => user._id !== currUser._id);                  
      // Set the updated users list
      setAllUsers(updatedUsers);
      setUser(currUser);
    } catch (error) {
      console.error('Error fetching user list:', error);
      toast.error('Error fetching user list');
    }
  }; 

  // Only On Edit Page to fetch Doc details
  const fetchDocDetails = async (docId) => {
    try {      
      // Current User
      const currUser = JSON.parse(localStorage.getItem("user"));    
      // Private key
      const key = localStorage.getItem('privateKey');   
      setPrivateKey(key);             
      // Document Details
      const doc = await fetchDocumentDetails(docId);
      setDocument(doc.document);
      setTitle(doc.document.title);
      if(key){
        const decryptedContent = await decryptDocumentContent(doc.document,key,currUser._id)
        setContent(decryptedContent);
      }
    }catch(error){
      console.error('Error fetching document details:', error);
      toast.error(`Error fetching document details: ${error}`);
    } 
  }

  const handleCollaboratorSelection = (userId) => {
    if(collaboratorList.includes(userId)){
      // If user Id already exists so unselect that id
      let collaborators = collaboratorList.filter(id => id !== userId)
      setCollaboratorList(collaborators);
    }else{
      // Else select that user Id
      setCollaboratorList([...collaboratorList, userId]);
    }
  };

  const handleSaveDocument = async () => {
    if (collaboratorList.length === 0) {      
      toast.error("Please select at least one collaborator!");
      return;
    }

    try {            
      // Create the document by passing the title, content, userId, and collaborator Ids
      const response = await createDocument(title, content, currentUser, collaboratorList);
      if (response) {
        toast.success("Document created successfully!");
        navigate('/dashboard')
      }
    } catch (error) {
      console.error("Error saving the document:", error);
      toast.error("Error saving the document");
    }
  }; 
  
  const changeDocument = async() => {
    if(!document){
      setShowModal(true)
    }else{      
        const response = await updateDocumentContent(document,privateKey,currentUser._id,content);
        if (response) {
          toast.success("Document updated successfully!");               
        }
      }
  }    

  return (    
    <>
      <Header />
      <div className="container">
      <h3 className="mt-3">Create New Document</h3>
      
      <div className="form-group">
        <label htmlFor="title">Document Title</label>
        <input
          type="text"
          id="title"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter document title"
          disabled={document}
        />
      </div>

      <div className="form-group mt-3">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          className="form-control"
          rows="10"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here"
        />
      </div>

      <button
        className="btn btn-primary mt-4"
        onClick={() => changeDocument()} // Open the modal for collaborators
      >
        Save Document
      </button>

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={modalStyles}
        contentLabel="Select Collaborators"
      >
        <h3>Select Collaborators</h3>
        <div className="collaborator-list">
          {allUsers.map((user) => (
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`collaborator-${user._id}`}                
                checked={collaboratorList.includes(user._id)}
                onChange={() => handleCollaboratorSelection(user._id)}
              />
              <label className="form-check-label" htmlFor={`collaborator-${user._id}`}>
                {user.username}
              </label>
            </div>
          ))}
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={() => {
            setShowModal(false);
            handleSaveDocument();
          }}
        >
          Save Document with Collaborators
        </button>
      </Modal>
      
    </div>
    </>
  );
};

export default AddDocumentPage;