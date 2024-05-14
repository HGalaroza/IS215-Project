import React, { useState } from 'react';
import './upload.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from './components/modal'; // Import the Modal component
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Upload() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [wrapperActive, setWrapperActive] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [facialResult, setfacialResult] = useState('');
  const navigate = useNavigate();

  const handleSelectBtnClick = () => {
    const defaultBtn = document.querySelector("#default-btn");
    defaultBtn.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setModalMessage('Invalid Image Size: File size exceeds 5MB limit.');
        setShowModal(true);
        return;
      }
      
      // Check if the selected file is an image (with extensions jpeg, jpg, png)
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        setModalMessage('Invalid Image Type:\nPlease select a JPEG, JPG, or PNG file.:');
        setShowModal(true);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function () {
        const result = reader.result;
        setImageSrc(result);
        setWrapperActive(true);
      };
      reader.readAsDataURL(file);
      setFile(file)
    }
    
    if (event.target.value) {
      let valueStore = event.target.value.match(/[0-9a-zA-Z^&'@{}[\],$=!-#().%+~_ ]+$/);
      setFileName(valueStore);
    }
  };

  const handleCancelBtnClick = () => {
    setImageSrc('');
    setFileName('File name here');
    setWrapperActive(false);
  };

  const handleUploadFile = async (event) => {
    event.preventDefault();
    if (!file) {
      setModalMessage('Please select a file first.:');
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    setLoading(true); // Start loading
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageData = event.target.result;
      const contentType = file.type;
      const fileName = file.name;

      const response = await fetch(process.env.REACT_APP_API_KEY_UPLOAD, {
        method: 'POST',
        body: JSON.stringify({ base64Image: imageData, contentType: contentType, fileName: fileName })
      });

      const result = await response.json();
      console.log(result);
      setLoading(false); // Stop loading
      

      if (response.ok) {
        if (result.facialAttributes && result.facialAttributes.length > 0) {
          // Extract facial analysis data for each face
          const facialAnalysisResults = result.facialAttributes.map((face, index) => {

            // Calculate coordinates and dimensions of the bounding box
            const { Left, Top, Width, Height } = face.BoundingBox;
            const image = new Image();
            image.src = imageSrc;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            // Set canvas dimensions to match cropped image dimensions
            canvas.width = image.width * Width;
            canvas.height = image.height * Height;
            // Crop the image
            ctx.drawImage(image, image.width * Left, image.height * Top, image.width * Width, image.height * Height, 0, 0, canvas.width, canvas.height);
            const croppedImage = canvas.toDataURL('image/jpeg'); // Convert cropped image to data URL

            //Highest confidence of emotion
            const firstEmotionType = face.Emotions[0].Type;

            return `:
              Face ${index + 1}:
              ${croppedImage}
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
              Does not have a beard: ${face.Beard.Value ? 'No' : 'Yes'} (${(face.Beard.Confidence).toFixed(1)}%)`;
          });
  
          // Construct the success message with facial analysis data for each face
          const successMessage = facialAnalysisResults.join('\n');
          setModalMessage(successMessage);

          const facialResult = successMessage.replace(/data:image\/jpeg;base64,[^\n]*\n?/g, '');
          setfacialResult(facialResult);
          setIsSuccess(true);

        } else {
          setModalMessage('No faces detected in the uploaded image.:');
          setIsSuccess(false);
        }

      } else {
      setModalMessage('Failed to upload image (Low quality image).\nPlease try again:');
      setIsSuccess(false);
      }
      setShowModal(true);
    };
    reader.readAsDataURL(file);

  };

  const closeModal = () => {
    setFile(null);
    setIsSuccess(false);
    setShowModal(false);
  };


  // Function to handle the Generate News button click
  const onGenerateNews = async () => {
    try {
      setLoading(true); // Start loading
      // Construct the prompt for generating the news article
      const prompt = "Write a well-formatted English news article (Pick one random topic: Achievement , Science, Environment, Education, Crime, Business, Economics, Pop Culture, Technology, Community ). Use the following details as description of the characters in the news. Do not use 'Face 1' 'Face 2' etc.  - create made up names. Do not use the percentages and do not provide author's name as well." + facialResult;
      console.log(prompt);
      // Send the prompt to the GPT-3 model
      const requestBody = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: "You are a news journalist." },
          { role: 'user', content: prompt }
        ]
      };
  
      const response = await axios.post(
        '/api/v1/chat/completions',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.REACT_APP_OPENAI_KEY,
          },
        }
      );
  
      console.log('Response:', response); // Log the entire response object
      const responseContent = response.data.choices[0].message.content;
      setLoading(false); // Stop loading

      // Create the JSON object representing the news article
      const newsArticle = {
        "headline": "", 
        "content": responseContent,
        "image": imageSrc // Assuming imageSrc is the image source
      };
      
      // Extract the headline from the beginning of the content
      const headline = responseContent.split("\n")[0];
      newsArticle.headline = headline;
      
      // Redirect to the news page with the article data
      navigate('/news', { state: { newsArticle } });

    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  return (

    <div className="upload">
      <header className='upload-header'>
      <div className={`container ${wrapperActive ? 'active' : ''}`}>
        <div className="wrapper" onMouseEnter={() => setWrapperActive(true)} onMouseLeave={() => setWrapperActive(false)}>
          <div className="image">
            {imageSrc && <img src={imageSrc} alt="Uploaded File" />}
          </div>
          <div className="content">
            <div className="icon"> <FontAwesomeIcon icon={faCloudUploadAlt} /> </div>
            <div className="text"> No file chosen, yet! </div>
          </div>
          {wrapperActive && (<div id="cancel-btn" onClick={handleCancelBtnClick}><FontAwesomeIcon icon={faTimes} /></div>)}
          {wrapperActive && (<div className="file-name"> {fileName || 'File name here'} </div>)}
        </div>
        <input type="file" id="default-btn" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
        <button onClick={handleSelectBtnClick} id="custom-btn"> Choose a file </button>
        <button onClick={handleUploadFile} id="custom-btn">{loading ? 'Uploading...' : 'Upload'}</button>
        {loading && (
                    <div className="upload-progress">
                        <div className="upload-progress-bar"></div>
                    </div>
                )}
      </div>
        {showModal && <Modal message={modalMessage} onClose={closeModal} isSuccess={isSuccess} loading={loading} onGenerateNews={onGenerateNews} />}
        </header>
    </div>
    
  );
}

export default Upload;
