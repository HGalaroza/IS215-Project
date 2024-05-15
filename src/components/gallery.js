import React, { useEffect, useState } from 'react';
import Card from './cards';

const Gallery = ({ images }) => {
  const [imageOrientations, setImageOrientations] = useState({});

  useEffect(() => {
    const newImageOrientations = {};
    
    images.forEach((image, index) => {
      const img = new Image();
      img.src = image.url;
      img.onload = () => {
        newImageOrientations[index] = img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait';
        if (Object.keys(newImageOrientations).length === images.length) {
          setImageOrientations(newImageOrientations);
        }
      };
    });
  }, [images]);

  return (
    <div className="gallery">
      {images.map((image, index) => (
        <Card
          key={index}
          title={truncateFilename(image.url.substring(image.url.lastIndexOf('/') + 1), 25)} // Truncate filename to 20 characters
          imageSrc={image.url} // Use the image URL from the images array
          description={<DescriptionToggle description={image.description} />} // Use the facial attributes description with toggle button
          className={imageOrientations[index]}
        />
      ))}
    </div>
  );
};

// Component to toggle the display of facial attributes description
const DescriptionToggle = ({ description }) => {
  const [showDescription, setShowDescription] = useState(false);

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  return (
    <div>
      {showDescription && (
        <div>
          {formatDescription(description)}
        </div>
      )}
      <button onClick={toggleDescription}>{showDescription ? 'Hide Analysis' : 'Show Analysis'}</button>
    </div>
  );
};

// Function to format the facial attributes description
const formatDescription = (description) => {
  if (description === 'No facial attributes detected') {
    return description;
  } else {
    return description.split('\n\n').map((faceAttributes, index) => (
      <div key={index}>
        <h4>Face {index + 1}:</h4>
        {faceAttributes.split('\n').slice(2).map((attribute, i) => (
          <p key={i}>{attribute}</p>
        ))}
      </div>
    ));
  }
};

const truncateFilename = (filename, maxLength) => {
  if (filename.length <= maxLength) {
    return filename;
  } else {
    const extensionIndex = filename.lastIndexOf('.');
    const extension = filename.substring(extensionIndex);
    const basename = filename.substring(0, extensionIndex);
    const truncatedBasename = basename.substring(0, maxLength - extension.length - 3); // 3 for "..."
    return truncatedBasename + '...' + extension;
  }
}

export default Gallery;
