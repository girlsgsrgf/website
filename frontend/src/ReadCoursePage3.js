import React from 'react';
import './ReadCoursePage.css';

const ReadCoursePage = () => {
  return (
    <div className="read-container">
      <img src="/icons/3course.png" alt="logo" className="read-image" />    

      <h2 className="read-title">Health</h2>

      <div className="read-card">
        <p className="read-text">
          Health is your real wealth. Without it, nothing else matters.
          <br /><br />
          Take care of your body and mind — they are the engines of your success. 
          Energy, focus, and creativity all flow from a healthy foundation.
          <br /><br />
          Daily movement, clean nutrition, sleep, and mental balance are non-negotiable.
          <br /><br />
          You can’t build an empire if you’re running on empty.
          <br /><br />
          Prioritize your health — because a strong you builds a strong future.
        </p>
      </div>
    </div>
  );
};

export default ReadCoursePage;
