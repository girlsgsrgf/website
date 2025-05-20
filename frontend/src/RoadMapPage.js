import React from 'react';
import './RoadMapPage.css';

const RoadMapPage = ({ onNavigate, balance }) => {
  return (
    <div className="main-page">
      <h2 className="app-title">Flyup Chain</h2>

      <div className="roadmap-section">
        <div className="roadmap-header">
          <div>
            <div className="roadmap-label">FLYP roadmap</div>
            <div className="roadmap-link">A selection of top courses to improve the three main aspects of life</div>
          </div>
          <img src="/icons/roadmap.png" alt="logo" className="logo-image-roadmap" />
        </div>
      </div>

      <div className="roadmap-card">
      <div className="roadmap-title">Create a telegram bot</div>       
      <div className="roadmap-subtitle">July 2025</div> 
      <img src="/icons/1course.png" alt="dot" className="roadmap-img" />
      </div> 
     
    </div>
  );
};

export default RoadMapPage;
