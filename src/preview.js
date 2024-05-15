import React, { useState, useEffect } from 'react';
import Gallery from './components/gallery';
import './components/cards.css';

function Preview() {
  const [imagesWithFacialAttributes, setImagesWithFacialAttributes] = useState([]);

  useEffect(() => {
    async function fetchFacialAttributes() {
      try {
        const response = await fetch(process.env.REACT_APP_API_KEY_PREVIEW, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          // Add any request body here if required
        });
        if (!response.ok) {
          throw new Error('Failed to fetch facial attributes');
        }
        const data = await response.json();
        console.log(data); // Log the response

        // Process the facial analysis results and map them to the images
        const imagesWithAttributes = data.images.map((image, index) => ({
          url: image.imageUrl,
          description: image.facialAttributes && image.facialAttributes.length > 0 ? formatFacialAttributes(image.facialAttributes) : 'No facial attributes detected'
      }));

        setImagesWithFacialAttributes(imagesWithAttributes);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchFacialAttributes();
  }, []);

  // Format facial attributes for display
  const formatFacialAttributes = (facialAttributes) => {
    return facialAttributes.map((face, index) => {
      const firstEmotionType = face.Emotions[0].Type;
      return `
        Face ${index + 1}:
        Looks like a face: ${(face.Confidence).toFixed(1)}%
        Appears to be ${face.Gender.Value.toLowerCase()}: ${(face.Gender.Confidence).toFixed(1)}%
        Age range: ${face.AgeRange.Low} - ${face.AgeRange.High} years old
        Smiling: ${face.Smile.Value ? 'Yes' : 'No'} (${(face.Smile.Confidence).toFixed(1)}%)
        Appears to be ${firstEmotionType.toLowerCase()}: ${(face.Emotions.find(emotion => emotion.Type === firstEmotionType).Confidence).toFixed(1)}%
        Wearing glasses: ${face.Eyeglasses.Value ? 'Yes' : 'No'} (${(face.Eyeglasses.Confidence).toFixed(1)}%)
        Wearing sunglasses: ${face.Sunglasses.Value ? 'Yes' : 'No'} (${(face.Sunglasses.Confidence).toFixed(1)}%)
        Eyes are open: ${face.EyesOpen.Value ? 'Yes' : 'No'} (${(face.EyesOpen.Confidence).toFixed(1)}%)
        Mouth is open: ${face.MouthOpen.Value ? 'Yes' : 'No'} (${(face.MouthOpen.Confidence).toFixed(1)}%)
        Does not have a mustache: ${face.Mustache.Value ? 'No' : 'Yes'} (${(face.Mustache.Confidence).toFixed(1)}%)
        Does not have a beard: ${face.Beard.Value ? 'No' : 'Yes'} (${(face.Beard.Confidence).toFixed(1)}%)
      `;
    }).join('\n\n');
  };

  return (
    <div>
      <header>
      <div className="containers">
        <h1>AWS S3 Bucket Image Gallery</h1>
        <Gallery images={imagesWithFacialAttributes} />
      </div>
      </header>
    </div>
  );
}

export default Preview;
