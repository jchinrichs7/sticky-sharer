import React, { useState, useEffect, useContext } from 'react';
import AWS from './aws-config';

function S3Uploader({ uploadButtonPressed, drawn, resetCanvas, resetUpload, clearCanvas, handleDownload }) 
{
    const [inputFileContent, setInputFileContent] = useState('');
    const [uploadLambdaMsg, setUploadLambdaMsg] = useState('');

    useEffect(() => 
    {
        if (drawn.length > 0) { handleUpload(); }
    }, [uploadButtonPressed]);  // Trigger when uploadButtonPressed changes

    function handleUpload() 
    {
        const lambda = new AWS.Lambda();
        const params = {
            FunctionName: 'sprite-uploader-downloader',
            Payload: JSON.stringify(
            {
                action: 'upload',
                payload: JSON.stringify(drawn),
            }),
        };

        lambda.invoke(params, function (err, data) 
        {
            if (err) { console.log("upload failed"); return; }

            //Success
            if (resetCanvas && typeof resetCanvas === 'function') { resetCanvas(); }
            if (clearCanvas && typeof clearCanvas === 'function') { clearCanvas(); }
            if (resetUpload && typeof resetUpload === 'function') { resetUpload(); }

            console.log("upload success");

            //this is a Promise and comes from the definition in app.js 
            handleDownload(); 
        });
    }

    function handleFileContentChange(event) 
    {
        setInputFileContent(event.target.value);
        setUploadLambdaMsg('');
    }

    return null //no html is required for this
};

export default S3Uploader;