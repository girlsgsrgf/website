import React from 'react';
import './CoursePage.css';

const CoursePage = ({ onNavigate, balance }) => {
  const handleCardClick = () => {
    onNavigate('readCourse'); // Переход на страницу чтения курса
  };

  return (
    <div className="main-page">
      <h2 className="app-title">Flyup Chain</h2>

      <div className="course-section">
        <div className="course-header">
          <div>
            <div className="course-label">FLYP courses</div>
            <div className="course-link">A selection of top courses to improve the three main aspects of life</div>
          </div>
          <img src="/icons/course_logo.png" alt="logo" className="logo-image-course" />
        </div>

        <button className="course-button" onClick={() => onNavigate('getflyp')}>
          <img src="/icons/unlock.png" alt="dot" className="get-img" /> Unlock
        </button>
      </div>

      {[...Array(5)].map((_, index) => (
        <div className="course-card" key={index} onClick={handleCardClick}>
          <img src="/icons/1course.png" alt="dot" className="course-img" />
          <div className="course-subtitle">
            Чтобы добиться успеха нужны три вещи: настойчивость, удача, труд и так далее...
          </div>
          <div className="course-title">Рычаг Власти</div>
        </div>
      ))}
    </div>
  );
};

export default CoursePage;

