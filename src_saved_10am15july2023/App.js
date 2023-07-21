import React, { useState, useRef, useMemo, useEffect } from 'react';
import S3Uploader from './S3Uploader';
import S3Downloader from './S3Downloader';
import Canvas from './Canvas';
import AWS from './aws-config';

const App = () => {
  const [drawn, setDrawn] = useState([]);
  const [uploadButtonPressed, setUploadButtonPressed] = useState(false);
  const [clearCanvas, setClearCanvas] = useState(() => () => {});
  const [downloadedData, setDownloadedData] = useState([]);

  useEffect(() => {
    (async () => {
      await handleDownload();
    })();
  }, []);

  const handleUploadButtonPress = () => {
    setUploadButtonPressed(true);
  };

  const resetUploadButtonPress = () => {
    setUploadButtonPressed(false);
  };

  const handleCanvasReset = () => {
    setDrawn([]);
  };

  const getClearCanvas = (clearCanvasFunction) => {
    setClearCanvas(() => clearCanvasFunction)
  };


  async function handleDownload() {
    const lambda = new AWS.Lambda();
    
    const params = {
      FunctionName: 'sprite-uploader-downloader',
      Payload: JSON.stringify({
        action: 'download',
        payload: '',
      }),
    };
    
    try {
      const data = await lambda.invoke(params).promise();
      const payload = JSON.parse(data.Payload);
      console.log(payload)
      
      // Split the payload string by '$' to separate each canvas
      const canvases = payload.split('$');
      
      // For each canvas, parse the coordinate data
      const parsedData = [];

      // Define a helper function for cleaning brackets and splitting by a delimiter
      function cleanAndSplit(input, delimiter) {
        const cleaned = input.replace(/^\[\[|\]\]$/g, '');
        return cleaned.split(delimiter);
      }

      for (let i = 0; i < canvases.length; i++) {

        // Remove any leading/trailing square brackets and split by '],[' to get each coordinate set
        const rawStrokes = cleanAndSplit(canvases[i], '],[');
        
        const fixedStrokes = [];
        for (let j = 0; j < rawStrokes.length; j++) {
          const stroke = rawStrokes[j];

          // Remove any leading/trailing square brackets and split by ',' to get individual coordinates
          const fixedStroke = cleanAndSplit(stroke, ',').map(Number);
          
          fixedStrokes.push(fixedStroke);
        }

        parsedData.push(fixedStrokes);
      }

      setDownloadedData(parsedData);
    } catch(err) {
      ;
    }
  }

  //S3Uploader doesn't need the new "drawn" until the button is pressed to upload
  //If we don't do it this way, we would be re-rendering constantly for no reason  
const memoizedS3Uploader = useMemo(() => {
  return (
    <S3Uploader 
      uploadButtonPressed={uploadButtonPressed}
      drawn={uploadButtonPressed ? drawn : []} 
      resetCanvas={handleCanvasReset} 
      resetUpload={resetUploadButtonPress} 
      clearCanvas={clearCanvas} 
      handleDownload={handleDownload}
    />
  );
}, [uploadButtonPressed, drawn, clearCanvas]);

  return (
    <div>
      <h1>Sticky Sharer</h1>
      <S3Downloader downloadedData={downloadedData} />
      {memoizedS3Uploader}
      <Canvas updateDrawn={setDrawn} resetCanvas={handleCanvasReset} getClearCanvas={getClearCanvas} />
      <button onClick={handleUploadButtonPress}>Share</button>
    </div>
  );
};


export default App;