import React, { useState, useEffect } from 'react';
import AWS from './aws-config';
import DownloadedCanvas from './DownloadedCanvas'

const S3Downloader = ({ downloadedData }) => {
  const [downloadLambdaMsg, setDownloadLambdaMsg] = useState('');
  const [error, setError] = useState(null);
  const [dl, setDl] = useState([])

  useEffect(() => {
    console.log('Returned by lambda download:');
    console.log(downloadedData);
    setDl(downloadedData)
  }, [downloadedData]);

  

  return (
    <>
      {dl.map((data, index) => (
        <DownloadedCanvas key={index} data={data} />
      ))}
    </>
  );
};

export default S3Downloader;