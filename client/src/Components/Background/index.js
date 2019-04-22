import React from 'react';
import BackgroundVideo from '../../media/background.mp4'
import './index.css';

function Background() {
    return (
        <div className="background-video-wrapper">
            <video loop muted autoPlay playsInline>
                <source src={BackgroundVideo} type="video/mp4" />
            </video>
        </div>
    );

}

export default Background;