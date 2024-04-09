// App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputs, setInputs] = useState({
    views: '',
    beams: '',
    scanResolution: '',
    sourceDistance: '',
    detectorDistance: '',
    detectorWidth: '',
  });

  const [methods, setMethods] = useState({
    mlcm: false,
    astra: false,
    mirt: false,
    tigre: false,
  });

  const [results, setResults] = useState({
    mlcmTime: '',
    astraTime: '',
    mirtTime: '',
    tigreTime: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setMethods({ ...methods, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // call the api and update results here
  };

  return (
    <div className="app">
      <div className="left-section">
        <form onSubmit={handleSubmit}>
          <label>
            Views:
            <input
              type="text"
              name="views"
              value={inputs.views}
              onChange={handleChange}
            />
          </label>
          <label>
            Beams:
            <input
              type="text"
              name="beams"
              value={inputs.beams}
              onChange={handleChange}
            />
          </label>
          <label>
            Scan Resolution:
            <input
              type="text"
              name="scanResolution"
              value={inputs.scanResolution}
              onChange={handleChange}
            />
          </label>
          <label>
            Source Distance:
            <input
              type="text"
              name="sourceDistance"
              value={inputs.sourceDistance}
              onChange={handleChange}
            />
          </label>
          <label>
            Detector Distance:
            <input
              type="text"
              name="detectorDistance"
              value={inputs.detectorDistance}
              onChange={handleChange}
            />
          </label>
          <label>
            Detector Width:
            <input
              type="text"
              name="views"
              value={inputs.detectorWidth}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Calculate</button>
        </form>
      </div>
      <div className="right-section">
        <div className="top-section">
          <label>
            MLCM Rasterization Algorithim:
            <input
              type="checkbox"
              name="mlcm"
              checked={methods.mlcm}
              onChange={handleCheckboxChange}
            />
          </label>
          <label>
            ASTRA Toolkit:
            <input
              type="checkbox"
              name="astra"
              checked={methods.astra}
              onChange={handleCheckboxChange}
            />
          </label>
          <label>
            MIRT:
            <input
              type="checkbox"
              name="mirt"
              checked={methods.mirt}
              onChange={handleCheckboxChange}
            />
          </label>
          <label>
            TIGRE:
            <input
              type="checkbox"
              name="tigre"
              checked={methods.tigre}
              onChange={handleCheckboxChange}
            />
          </label>
        </div>
        <div className="bottom-section">
          <p>MLCM Time: {results.mlcmTime}</p>
          <p>ASTRA Time: {results.astraTime}</p>
          <p>MIRT Time: {results.mirtTime}</p>
          <p>TIGRE Time: {results.tigreTime}</p>
        </div>
      </div>
    </div>
  );
}

export default App;