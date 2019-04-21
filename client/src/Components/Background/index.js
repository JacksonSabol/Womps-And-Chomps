import React, { Component } from 'react';
import BackgroundVideo from '../../media/background.mp4'
import './index.css';

class Background extends Component {
    // Placeholder
    state = {
        videoUrl: ""
    };

    render() {
        return (
            <div className="background-video-wrapper">
                <video loop muted autoPlay playsInline>
                    <source src={BackgroundVideo} type="video/mp4" />
                </video>
            </div>
        );

    }
}

export default Background;