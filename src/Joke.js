import React from "react";
import "./Joke.css";

// Joke component takes id, vote function, votes, and text as props
const Joke = ({ id, vote, votes, text }) => {
  return (
    <div className="Joke">
      {/* Vote area with thumbs-up and thumbs-down buttons */}
      <div className="Joke-votearea">
        {/* Button to upvote the joke */}
        <button onClick={() => vote(id, +1)}>
          <i className="fas fa-thumbs-up" />
        </button>

        {/* Button to downvote the joke */}
        <button onClick={() => vote(id, -1)}>
          <i className="fas fa-thumbs-down" />
        </button>

        {/* Display the current vote count */}
        {votes}
      </div>

      {/* Display the text of the joke */}
      <div className="Joke-text">{text}</div>
    </div>
  );
};

export default Joke;
