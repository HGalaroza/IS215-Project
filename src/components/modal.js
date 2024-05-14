import React from 'react';
import '../upload.css';

function Modal({ message, onClose, isSuccess, loading, onGenerateNews }) {

  // Parse the message into rows for table rendering
  const rows = message.split('\n').map((row, index) => {
    // Check if the row contains an image URL
    if (row.includes('data:image/jpeg;base64,')) {
      // If it's an image URL, render it as an image
      return (
        <tr key={index}>
          <td colSpan="2" className="modal-image-container">
            <img src={row} alt="Cropped Face" className="modal-image" />
          </td>
        </tr>
      );
    } else {
      // If it's not an image URL, render it as text
      return (
        <tr key={index}>
          {row.split(':').map((cell, index) => (
            <td key={index}>{cell}</td>
          ))}
        </tr>
      );
    }
  });

  return (
    <div className={`modal ${isSuccess ? 'success' : 'failure'}`}>
      <div className="modal-content">
        <div className="modal-header">
          <span className="close" onClick={onClose}>&times;</span>
          <h5>{isSuccess ? 'Image Uploaded Successfully!' : 'Error: Please Try Again'}</h5>
        </div>
        <div className="modal-body">
          <table className="modal-table">
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
        <div className="modal-footer">
          {isSuccess && (
            <button onClick={onGenerateNews}>{loading ? 'Generating news...' : 'Generate News'}</button>
          )}
            {loading && (
                      <div className="upload-progress">
                        <div className="upload-progress-bar"></div>
                      </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Modal;