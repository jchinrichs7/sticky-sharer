import React, { useEffect, useRef } from 'react';

const DownloadedCanvas = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => 
  {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.strokeStyle = 'black';
    context.lineWidth = 3;

    // Set the fill style and fill the canvas
    context.fillStyle = '#a9edf1';
    context.fillRect(0, 0, canvas.width, canvas.height);

    data.forEach(stroke => {
      context.beginPath();
      context.moveTo(stroke[0], stroke[2]);
      context.lineTo(stroke[1], stroke[3]);
      context.stroke();
    });
  }, [data]);

  return (
    <canvas ref={canvasRef} width="150" height="150" style={{ border: '1px solid #000000' }} />
  );
};

export default DownloadedCanvas;