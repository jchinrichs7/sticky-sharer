import React, { useState, useRef, useMemo, useEffect } from 'react';
import S3Uploader from './S3Uploader';
import S3Downloader from './S3Downloader';
import Canvas from './Canvas';
import AWS from './aws-config';
import { FiSend } from 'react-icons/fi';
import { BsFillEraserFill } from 'react-icons/bs'; //https://react-icons.github.io/react-icons/search?q=stick
import './App.css';

function App() 
{
  const [drawn, setDrawn] = useState([]);
  const [uploadButtonPressed, setUploadButtonPressed] = useState(false);
  //clear canvas is a function that will be replaced later
  const [clearCanvas, setClearCanvas] = useState(() => () => {}); 
  const [downloadedData, setDownloadedData] = useState([]);

  //no dependency, so this is called immediately
  useEffect( () =>
  {
    const download = async () => { await handleDownload();};
    download();
  }, []);

  function handleUploadButtonPress() {
    setUploadButtonPressed(true);
  }

  function resetUploadButtonPress() 
  {
    setUploadButtonPressed(false);
  }

  function handleCanvasReset() 
  {
    setDrawn([]);
  }

  function clearAndResetCanvas()
  {
    handleCanvasReset();
    clearCanvas();
  }

  function getClearCanvas(clearCanvasFunction) 
  {
    setClearCanvas(() => clearCanvasFunction);
  }

  async function handleDownload() 
  {
    const lambda = new AWS.Lambda();
    
    const params = 
    {
      FunctionName: 'sprite-uploader-downloader',
      Payload: JSON.stringify({ action: 'download', payload: '', }),
    };
    
    try 
    {
      const data = await lambda.invoke(params).promise();
      const payload = JSON.parse(data.Payload);
      console.log(payload)
      
      // Get canvases using $ delimiter
      const canvases = payload.split('$');
      
      // For each canvas, parse the coordinate data
      const parsedData = [];

      for (let i = 0; i < canvases.length; i++) 
      {
        const rawStrokes = canvases[i].replace(/^\[\[|\]\]$/g, '').split( '],[');
        const fixedStrokes = [];
        for (let j = 0; j < rawStrokes.length; j++) 
        {
          fixedStrokes.push(rawStrokes[j].replace(/^\[\[|\]\]$/g, '').split(',').map(Number));
        }
        parsedData.push(fixedStrokes);
      }
      setDownloadedData(parsedData);
    } 
    catch(err) 
    { 
      console.log(err); 
    }
  }

  //useMemo is called whenever one of its dependencies change.
  //we do the uploader this way, because there's no need to constantly be updating "drawn"
  //with what the user draws. it only matters when they hit upload, 
  //at which point uploadbuttonpressed calls setDrawn and then it gets sent to lambda
  const memoizedS3Uploader = useMemo(
    () => 
    {
      return (
        <S3Uploader 
          uploadButtonPressed={uploadButtonPressed}
          drawn={uploadButtonPressed ? drawn : []} 
          resetCanvas={(handleCanvasReset)} 
          resetUpload={resetUploadButtonPress} 
          clearCanvas={clearCanvas} 
          handleDownload={handleDownload}
        />
      );
    }, 
    //dependencies
    //we dont need drawn because uploadbuttonpressed updates drawn itself
    [uploadButtonPressed]
  );

 return (
  <div className="app-container">
    <a href="http://campbells-projects.com/" target="_blank" rel="noopener noreferrer" className="external-link">
      Info about this project & others here !
    </a>
    <span className="left-margin">
      <h1>Sticky Sharer</h1>
      <S3Downloader downloadedData={downloadedData} />
      {memoizedS3Uploader}
      <h2>Say "Hello World" with your own drawing !</h2>
      <Canvas updateDrawn={setDrawn} resetCanvas={handleCanvasReset} getClearCanvas={getClearCanvas} />
      <button onClick={handleUploadButtonPress}><FiSend /></button>
      <button onClick={clearAndResetCanvas}><BsFillEraserFill /></button>    
    </span>
  </div>
);

};

export default App;