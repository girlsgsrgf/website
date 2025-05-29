import React from 'react';
import './ReadCoursePage.css';

const ReadCoursePage = ({ onNavigate }) => {
  return (
    <div className="read-container">
      <img src="/icons/1course.png" alt="logo" className="read-image" />    

      <h2 className="read-title">Value</h2>

      <div className="read-card">
        <p className="read-text">
          If you want to become truly wealthy, focus on delivering real value to others. 
          Wealth follows those who solve problems, ease pain, and make lives better.
          <br /><br />
          People are willing to pay — generously — when you help them overcome challenges. 
          That’s the foundation of every successful business and brand.
          <br /><br />
          The more value you create, the more impact you have — and the more income you generate. 
          <br /><br />
          Stop chasing money. Start solving problems.
          <br /><br />
          That’s how leaders and creators build empires.
        </p>
      </div>
    </div>
  );
};

export default ReadCoursePage;
