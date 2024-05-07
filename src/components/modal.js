import React from 'react';
import '../upload.css';

function Modal({ message, onClose, isSuccess, onViewNews }) {

  // Parse the message into rows for table rendering
  const rows = message.split('\n').map((row, rowIndex) => {
    const cells = row.split(':');
    // Check if the row has at least one cell
    if (cells.length > 1) {
      return (
        <tr key={rowIndex}>
          {cells.map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
          ))}
        </tr>
      );
    } else {
      return null; // Skip rendering empty rows
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
            <button onClick={onViewNews}>Generate News</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;