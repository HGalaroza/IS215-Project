import React, { useState } from 'react';
import '../components/cards.css';
import { useNavigate } from 'react-router-dom';

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);

const Card = ({ title, imageSrc, description }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleButtonClick = async () => {
        setLoading(true); // Start loading
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = "You are a news journalist, write a well-formatted English news article (Pick one random topic: Achievement , Science, Environment, Education, Crime, Business, Economics, Pop Culture, Technology, Community ). Use the following details as description of the characters in the news. Do not use 'Face 1' 'Face 2' etc.  - create made up names. Do not use the percentages and do not provide author's name as well." + description.props.description;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        // Create the JSON object with headline and content
        const newsArticle = {
            "headline": "", 
            "content": text,
            "image": imageSrc 
        };

        // Extract the headline from the beginning of the text
        const headline = text.split("\n")[0];
        newsArticle.headline = headline;

        setLoading(false); // Stop loading
        navigate('/news', { state: { newsArticle } }); // Redirect to the news page
    };

    return (
        <div className="card">
            <img src={imageSrc} alt={title} />
            <div className="card-body">
                <h3>{title}</h3>
                <p>{description}</p>
                <button onClick={handleButtonClick}>{loading ? 'Generating news...' : 'View News'}</button>
                {loading && (
                    <div className="progress-modal">
                        <div className="progress-bar"></div>
                    </div>
                )}
            </div>
        </div>
    );

};

export default Card;

//npm install @google/generative-ai