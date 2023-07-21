import React, { useRef, useEffect, useState, useCallback } from 'react';

const Canvas = ({ updateDrawn, resetCanvas, getClearCanvas }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [positions, setPositions] = useState({ lastX: 0, lastY: 0, x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.style.cursor = 'crosshair';
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.fillStyle = '#a9edf1';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const clearCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#a9edf1';
      context.fillRect(0, 0, canvas.width, canvas.height);
  }, []); // Pass an empty array as dependencies

  useEffect(() => {
    getClearCanvas(clearCanvas);
  }, [clearCanvas]);


  const startDrawing = (event) => {
    setDrawing(true);
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setPositions({ ...positions, lastX: x, lastY: y });
  };

  const finishDrawing = () => {
    setDrawing(false);
  };

  const draw = (event) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(positions.lastX, positions.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (updateDrawn && updateDrawn instanceof Function) {
      updateDrawn((prevDrawn) => [...prevDrawn, [positions.lastX, x, positions.lastY, y]]);
    }

    setPositions({ ...positions, lastX: x, lastY: y });
  };

  const handleReset = () => {
    clearCanvas();
    resetCanvas();
  };

  return (
    <div>
      <canvas
        display="inline-block"
        ref={canvasRef}
        width="150"
        height="150"
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        style={{ cursor: 'crosshair', border: '1px solid #000000' }}
      />
    </div>
  );
};

export default Canvas;
