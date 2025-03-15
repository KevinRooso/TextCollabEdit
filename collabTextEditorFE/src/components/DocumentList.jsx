import React, { useEffect, useState } from "react";
import { fetchDocumentList } from "../services/DocumentService";
import { useNavigate } from "react-router-dom";

const DocumentsList = ({ userId }) => {
  const [documents, setDocuments] = useState([]);  
  const navigate = useNavigate();

  useEffect(() => {  
    // Current User
    const currUser = JSON.parse(localStorage.getItem("user"));
    if (currUser) {
      //Fetching Docs for Current User
      fetchDocuments(currUser._id);      
    }
    }, [userId]);

    const fetchDocuments = async (userId) => {
      const docs = await fetchDocumentList(userId);
      setDocuments(docs.documents);
    }
  
    const handleEditDocument = (doc) => {
      // Navigate to the edit page with the document ID
      navigate(`/dashboard/document/${doc._id}`);
    };  
  
    return (
      <div className="documents-list text-center mt-4 ">  
  
        <div className="row">
          { documents.length === 0 ? (
            <p>You have no documents yet.</p>
          ) : (
            documents.map((doc) => (
              <div className="col-md-4" key={doc.id}>
                <div
                  className="card document-card"
                  onClick={() => handleEditDocument(doc)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">{doc.title}</h5>
                    <p className="card-text">
                      <strong>Created on:</strong> {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                      <strong>Last modified:</strong> {new Date(doc.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
      </div>
    );
  };
  
  export default DocumentsList;
  