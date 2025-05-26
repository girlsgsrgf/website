import React from 'react';

const ReadCoursePage = ({ onNavigate }) => {
  return (
    <div style={{ padding: '20px' }}>
    <img src="/icons/readimage.png" alt="logo" className="read-image" />    
      <h2 className='read-title'>Рычаг Власти</h2>
      <div className='read-card'>
      <p className='read-text'>Полный те2кст курса и полезные материалы...</p>
      </div>
    </div>
  );
};

export default ReadCoursePage;
