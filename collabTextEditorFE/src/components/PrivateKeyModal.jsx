// PrivateKeyModal.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';

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

const PrivateKeyModal = ({ isOpen, onRequestClose, onSave }) => {
  const [privateKey, setPrivateKey] = useState('');

  const handleSaveKey = () => {
    if (privateKey) {
      // Save private key to localStorage
      localStorage.setItem('privateKey', privateKey);
      onSave(privateKey);  // Notify parent component that key is saved
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      contentLabel="Load Private Key"
    >
      <h3>Load Your Private Key</h3>
      <textarea
        className="form-control"
        rows="5"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        placeholder="Paste your private key here"
      />
      <button className="btn btn-primary mt-3" onClick={handleSaveKey}>
        Load Private Key
      </button>
    </Modal>
  );
};

export default PrivateKeyModal;
