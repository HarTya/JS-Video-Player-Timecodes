import React, {useRef} from "react";
import VideoPlayer from "./VideoPlayer"

const App = () => {
  const playerRef = useRef(null);

  const videoJsOptions = {
    controls: true,
    playbackRates: [0.5, 1, 2],
    bigPlayButton: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      type: "video/mp4"
    }]
  }

  const handlePlayerReady = (player) => {
    playerRef.current = player;
  };

  return (
    <div className="App">
      <div className="videoJsCustomWrapper">
        <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
      </div>
    </div>
  );
};

export default App;