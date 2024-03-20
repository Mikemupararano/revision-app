
import React from "react";
import PropTypes from "prop-types";

const Tutorial = ({ embedId }) => (
    <div className="video-responsive">
        <iframe
            // width="700"
            // height="200"
            src={`https://www.youtube.com/embed/${embedId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="TutorialVideo"
        />
    </div>
);

Tutorial.propTypes = {
    embedId: PropTypes.string.isRequired
};

export default Tutorial;

