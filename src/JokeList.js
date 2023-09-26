import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

const JokeList = ({ numJokesToGet = 5 }) => {
  // State for storing jokes, loading state, and initial fetch
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to fetch jokes from API or localStorage
    const fetchJokes = async () => {
      try {
        // Load stored jokes from localStorage or initialize an empty array
        let storedJokes = JSON.parse(localStorage.getItem("jokes")) || [];

        if (storedJokes.length < numJokesToGet) {
          let seenJokes = new Set(storedJokes.map((j) => j.id));

          while (storedJokes.length < numJokesToGet) {
            // Fetch a new joke from the API
            let res = await axios.get("https://icanhazdadjoke.com", {
              headers: { Accept: "application/json" },
            });
            let { ...joke } = res.data;

            if (!seenJokes.has(joke.id)) {
              // Add the new joke to the list if it's not a duplicate
              seenJokes.add(joke.id);
              storedJokes.push({ ...joke, votes: 0, locked: false });
            } else {
              console.log("duplicate found!");
            }
          }
        }

        // Set the jokes state and update loading state
        setJokes(storedJokes);
        setIsLoading(false);
        // Store the jokes in localStorage
        localStorage.setItem("jokes", JSON.stringify(storedJokes));
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch jokes when the component mounts or when the number of jokes to get changes
    fetchJokes();
  }, [numJokesToGet]);

  // Function to generate new jokes
  const generateNewJokes = () => {
    setIsLoading(true);
    // Remove jokes from local storage and reset the jokes state
    localStorage.removeItem("jokes");
    setJokes([]);
  };

  // Function to reset vote counts and clear local storage
  const resetVotesAndLocalStorage = () => {
    // Reset vote counts for all jokes and clear local storage
    setJokes((prevJokes) => prevJokes.map((j) => ({ ...j, votes: 0 })));
    localStorage.removeItem("jokes");
  };

  // Function to toggle the "lock" state of a joke
  const toggleLock = (id) => {
    // Toggle the "locked" property for the specified joke
    setJokes((prevJokes) =>
      prevJokes.map((j) => (j.id === id ? { ...j, locked: !j.locked } : j))
    );
  };

  // Function to handle voting on a joke
  const vote = (id, delta) => {
    // Update the vote count for the specified joke
    setJokes((prevJokes) =>
      prevJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  };

  return (
    <div className="JokeList">
      <h1>Joke List</h1>
      <div className="buttons-container">
        {/* Button to generate new jokes */}
        <button className="JokeList-getmore" onClick={generateNewJokes}>
          Get New Jokes
        </button>
        {/* Button to reset votes and clear local storage */}
        <button className="JokeList-reset" onClick={resetVotesAndLocalStorage}>
          Reset Votes and Clear Local Storage
        </button>
      </div>

      {isLoading ? (
        // Display a loading spinner while fetching jokes
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      ) : (
        // Display the list of jokes
        <div className="jokes-container">
          {jokes.map((j) => (
            <Joke
              text={j.joke}
              key={j.id}
              id={j.id}
              votes={j.votes}
              locked={j.locked}
              vote={vote}
              toggleLock={toggleLock}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JokeList;
