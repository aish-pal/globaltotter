import React, { useEffect, useState } from "react";

const User = () => {
  const [cities, setCities] = useState([]);
  const [hints, setHints] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [result, setResult] = useState(null); // Store result message
  const [score, setScore] = useState(0); // State to hold the score

  useEffect(() => {
    fetch("http://localhost:5000/cities/random") // Backend API
      .then((res) => res.json())
      .then((data) => {
        setCities(data); // Backend data
        if (data.length > 0) {
          setHints(data[0].clues || []); // First city hints
        }
      })
      .catch((err) => console.error("Error fetching cities:", err));
  }, []);

  const handleSubmit = () => {
    if (selectedCity === cities[0]?.city) {
      setResult("🎉 Correct!");
      setScore(score + 1); // Increment score if answer is correct
    } else {
      setResult("😢 Tough Luck! Try Again.");
    }
  };

  const handlePlayAgain = () => {
    // Reset all states to their initial values
    setSelectedCity(null);
    setResult(null);
    setHints([]);
    fetch("http://localhost:5000/cities/random") // Fetch a new city
      .then((res) => res.json())
      .then((data) => {
        setCities(data); // Update cities with a new random city
        if (data.length > 0) {
          setHints(data[0].clues || []); // Set the hints for the new city
        }
      })
      .catch((err) => console.error("Error fetching new city:", err));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 font-sans">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">
        Can You Guess the City? 🌍
      </h1>

      {/* Display Score */}
      <div className="text-xl font-medium text-gray-700 mb-6">
        Score: <span className="font-bold text-indigo-600">{score}</span>
      </div>

      {/* City Selection */}
      <div className="space-y-4 w-full max-w-lg">
        {cities.map((city) => (
          <label
            key={city._id}
            className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <input
              type="radio"
              name="city"
              value={city.city}
              onChange={() => setSelectedCity(city.city)}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-600"
            />
            <span className="font-medium text-gray-800">{city.city}</span>
          </label>
        ))}
      </div>

      {/* Hints Section */}
      {hints.length > 0 && (
        <div className="mt-10 p-8 bg-white rounded-xl shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Clues</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-3">
            {hints.map((hint, index) => (
              <li key={index} className="text-lg">{hint}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
      >
        Submit
      </button>

      {/* Result Message */}
      {result && (
        <p
          className={`mt-6 text-2xl font-semibold ${
            result.includes("Correct") ? "text-green-600" : "text-red-600"
          }`}
        >
          {result}
        </p>
      )}

      {/* Play Again Button */}
      <button
        onClick={handlePlayAgain}
        className="mt-6 bg-gray-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 transform hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );
};

export default User;