import React from 'react';
import './LodingSpinner.scss';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Загрузка задач...</p>
    </div>
  );
};

export default LoadingSpinner;
