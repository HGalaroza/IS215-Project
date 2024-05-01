import React from 'react';
import './news.css';
import { useLocation } from 'react-router-dom';

function News() {
  const location = useLocation();
  const newsArticle = location.state.newsArticle;

  // Function to replace occurrences of **text** with <strong>text</strong>
  const renderContentWithBold = (text) => {
    return text.split(/\*\*(.*?)\*\*/g).map((chunk, index) => {
      if (index % 2 === 0) {
        return <span key={index}>{chunk}</span>;
      } else {
        return <strong key={index}>{chunk}</strong>;
      }
    });
  };

  // Split the content string by newline character '\n' and render each paragraph
  const paragraphs = newsArticle.content.split('\n').map((paragraph, index) => (
    <p key={index}>{renderContentWithBold(paragraph)}</p>
  ));

  return (
    <div className="News">
      <header className="News-header">
        <h1>News Patrol Central: Automated Updates for Today's Headlines</h1>
      </header>
      <main>
        <div className="article">
          <div className="article-content">
            <h2> {renderContentWithBold(newsArticle.headline)} </h2>
            <div className="image-container">
              <img src={newsArticle.image} alt={newsArticle.headline} className="article-image" />
              <div className="image-caption">
                <p>Picture captured by Group-5</p>
              </div>
            </div>
            {paragraphs}
          </div>
        </div>
      </main>
      <footer>
        <p>© 2024 Automatic News Generation</p>
      </footer>
    </div>
  );
}

export default News;
