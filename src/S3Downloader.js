import React, { useState, useEffect, useRef } from 'react';
import AWS from './aws-config';
import DownloadedCanvas from './DownloadedCanvas';
import './S3Downloader.css';

const S3Downloader = ({ downloadedData }) => {
  const [downloadLambdaMsg, setDownloadLambdaMsg] = useState('');
  const [error, setError] = useState(null);
  const [dl, setDl] = useState([]);
  const carouselRef = useRef(null);
  const itemWidth = 150;
  const spacing = 20;

  useEffect(() => {
    console.log('Returned by lambda download:');
    console.log(downloadedData);
    setDl(downloadedData);
  }, [downloadedData]);

  const handleNext = () => {
    carouselRef.current.scrollBy(itemWidth + spacing, 0);
  };

  const handlePrev = () => {
    carouselRef.current.scrollBy(-(itemWidth + spacing), 0);
  };

  return (
    <div className="carousel-wrapper">
      <div className="carousel-container" ref={carouselRef}>
        {dl.map((data, index) => (
          <DownloadedCanvas key={index} data={data} />
        ))}
      </div>
      <div className="carousel-controls">
        <button className="carousel-prev" onClick={handlePrev}></button>
        <button className="carousel-next" onClick={handleNext}></button>
      </div>
    </div>
  );
};

export default S3Downloader;
