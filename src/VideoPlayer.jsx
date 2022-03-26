import React, {useEffect, useRef} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./App.css";
import VideoTimecodes from "./VideoTimecodes";

export const VideoPlayer = ( props ) => {

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady } = props;

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const player = playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player);
      });
    }
  }, [options, videoRef, onReady])

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef])

  const timecodeRewindConfirmation = (time) => {
    videoRef.current.currentTime = time;
  };

  return (
    <div>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js vjs-big-play-centered" />
      </div>
      <VideoTimecodes timecodeRewindConfirmation={timecodeRewindConfirmation} /> 
    </div>
  );
};

export default VideoPlayer;