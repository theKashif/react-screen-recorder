import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  // define states to manage the screen capturing process
  const [stream, setStream] = useState(null)
  const [recorder, setRecorder] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)

  // define a function to start capturing the screen
  const handleCaptureClick = async () => {
    try {
      //  use the getDisplayMedia method to access the screen
      const stream = await navigator.mediaDevices.getDisplayMedia();
      setStream(stream);

      // create and object to recorder the screen
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      setRecorder(recorder);

      // create and array to store the recorder data chunks
      const chunks = [];
      recorder.ondataavailable = event => chunks.push(event.data);

      // when recording stops, create a blob object and url for the recorder video
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setVideoUrl(videoUrl);
      };

       // Start recording
      recorder.start();
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  //  define a funtion to stop capturing the screen
  const handleStopClick = () => {
    recorder.stop();
    stream.getTracks().forEach(track => track.stop());
  }

  // define a funtion to handle the downloading
  const handleDownloadClick = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'screen-recording.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // reload the page to remove video preview section
    window.location.reload();
  }

  return (
    <>
      <div className='screen-capture'>
        <h1>React Screen Recorder</h1>

        {videoUrl ? (
          //  if the videourl is true then render the following sections
          <div className='preview'>
            <video src={videoUrl} controls width="640" height="360" />
            <button onClick={handleDownloadClick}>Download</button>
          </div>
        ) : (
          <>
            {stream ? (
              <div className='preview'>
                <video srcObject={stream} autoPlay width="640" height="360" />
                <button onClick={handleStopClick}>Stop</button>
              </div>
            ) : (
              <button className="capture-button" onClick={handleCaptureClick}>Capture Screen</button>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;
