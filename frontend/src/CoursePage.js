import React from 'react';
import './CoursePage.css';

const CoursePage = ({ onNavigate, balance }) => {
  const handleCardClick = () => {
    onNavigate('readCourse'); // Переход на страницу чтения курса
  };

  return (
    <div className="main-page">
      <h2 className="app-title">Flyup Ecosystem</h2>

      <div className="course-section">
        <div className="course-header">
          <div>
            <div className="course-label">FLYP Courses</div>
            <div className="course-link">A curated collection of top-tier courses designed to enhance three key areas of life.</div>
          </div>
          <img src="/icons/course_logo.png" alt="logo" className="logo-image-course" />
        </div>

      </div>

        <div className="course-card" onClick={() => onNavigate('readCourse1')}>
          <img src="/icons/1course.png" alt="dot" className="course-img" />
          <div className="course-subtitle">
            Want to get rich? Solve problems. People pay for value — not hype. Focus on helping, and rest will follow...
          </div>
          <div className="course-title">Value</div>
        </div>

        <div className="course-card" onClick={() => onNavigate('readCourse2')}>
          <img src="/icons/2course.png" alt="dot" className="course-img" />
          <div className="course-subtitle">
            Love isn’t just emotion — it’s care, and growth. To receive love, learn to give it without fear...
          </div>
          <div className="course-title">Love</div>
        </div>

        <div className="course-card" onClick={() => onNavigate('readCourse3')}>
          <img src="/icons/3course.png" alt="dot" className="course-img" />
          <div className="course-subtitle">
            Your body is your foundation. Without health, success is hollow. Prioritize energy, and longevity every day...
          </div>
          <div className="course-title">Health</div>
        </div>

    </div>
  );
};

export default CoursePage;

