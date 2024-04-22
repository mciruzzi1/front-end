import React, { useState } from 'react';
import './App.css';
import ReactModal from 'react-modal';

function App() {
  const NUM_DETECTORS = {
    16: 43,
    32: 83,
    64: 161,
    128: 321,
    256: 639,
    512: 1273,
    1024: 2543,
    2048: 5085,
    4096: 10167
  };
  
  const [inputs, setInputs] = useState({
    size: '',
    distance: '',
    detectors: '',
    views: '',
    iterations: ''
  });

  const [methods, setMethods] = useState({
    mlcm: false,
    astra_cpu: false,
    astra_gpu: false,
    tigre: false,
  });

  const [results, setResults] = useState({
    mlcm_time: '',
    astra_cpu_time: '',
    astra_gpu_time: '',
    tigre_time: '',
  });

  const [statusData, setStatusData] = useState({ running: false, completed: false, message: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/status');
        const data = await response.json();

        if (data["completed"] === true) {
          fetch('http://localhost:8000/results').then((response) => response.json()).then((data) => {
          setResults(r => ({...r, "mlcm_time": data["custom_gpu_avg"], "astra_cpu_time": data["astra_cpu_avg"], "astra_gpu_time": data["astra_gpu_avg"], "tigre_time": data["tigre_gpu_avg"]}));
        })
        }

        setStatusData(s => ({...s, "running": data["running"], "completed": data["completed"], "message": data["message"]}));
      } catch (error) {
        console.error('Error fetching data:', error);
        // Optionally display an error message to the user
      }
    };

    const intervalId = setInterval(fetchData, 200); // Update every 100 milliseconds (approximately 10 times per second)

    return () => clearInterval(intervalId); // Cleanup function to clear the interval on unmount
  }, []);

  //Set the state for the about section
  const [isOpen, setIsOpen] = useState(false);

  const[helpButtonHoverV, setHelpButtonHoverV] = useState(false);
  const[helpButtonHoverB, setHelpButtonHoverB] = useState(false);
  const[helpButtonHoverR, setHelpButtonHoverR] = useState(false);
  const[helpButtonHoverSD, setHelpButtonHoverSD] = useState(false);
  const[helpButtonHoverDD, setHelpButtonHoverDD] = useState(false);
  const[helpButtonHoverDW, setHelpButtonHoverDW] = useState(false);

  //Change the data values as the user updates them
  const handleDataInput = (e) => {
    const { name, value } = e.target;
    
    if (name === "size" && value in NUM_DETECTORS) {
      setInputs({ ...inputs, [name]: value, "distance": value * 2, "detectors": NUM_DETECTORS[value] });
    }
    else if (name === "size") {
      setInputs({ ...inputs, [name]: value, "distance": value * 2 });
    }
    else {
      setInputs({ ...inputs, [name]: value});
    }
  };

  //Change the methods used as the user updates them
  const handleMethodInput = (e) => {
    const { name, checked } = e.target;
    setMethods({ ...methods, [name]: checked });
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    fetch('http://localhost:8000/run', {method:"POST", body: JSON.stringify({
      "size": inputs.size,
      "distance": inputs.distance,
      "detectors": inputs.detectors,
      "iterations": inputs.iterations,
      "views": inputs.views,
      "items": {
        "astra_cpu": methods.astra_cpu,
        "astra_gpu": methods.astra_gpu,
        "tigre_gpu": methods.tigre,
        "custom_gpu": methods.mlcm
      },
      }),headers: {
        'Content-type': 'application/json; charset=UTF-8',
     },
    })
  };

  //Set each value back to its original state
  const handleReset = (e) =>{
    fetch('http://localhost:8000/reset', {method:"POST"})
    
    setInputs({
      size: '',
      distance: '',
      detectors: '',
      views: '',
      iterations: '',
    });

    setMethods({
      astra_cpu: false,
      astra_gpu: false,
      mlcm: false,
      tigre: false,
    });

    setStatusData({
      running: false,
      completed: false,
      message: []
    })

    setResults({
      astra_cpu_time: 0.0,
      astra_gpu_time: 0.0,
      mlcm_time: 0.0,
      tigre_time: 0.0
    })
  }

  return (
    <div className="app">
      <h1>MLCM Senior Project</h1>
      <h2>Fanbeam Computed Tomography Forward Model in OpenGL</h2>
      <div className="user-input">
        <div className="data-input">
          <form className = "variable-form" onSubmit={handleSubmit}>
            <label>
              Views: 
              <input
                type="number"
                name="views"
                value={inputs.views}
                onChange={handleChange}
              />
              <button className='help-btn'
              onMouseEnter={() => setHelpButtonHoverV(true)}
              onMouseLeave={() => setHelpButtonHoverV(false)}
              >
                ?
              </button>
              {helpButtonHoverV && <div className="tooltip">This modifies the number of views used</div>}
            </label>
            <label>
              Source & Detector Distance: 
              <input
                type="number"
                name="beams"
                value={inputs.beams}
                onChange={handleChange}
              />
              <button className='help-btn'
              onMouseEnter={() => setHelpButtonHoverB(true)}
              onMouseLeave={() => setHelpButtonHoverB(false)}
              >
                ?
              </button>
              {helpButtonHoverB && <div className="tooltip">This modifies the number of beams produced</div>}
            </label>
            <label>
              Number of Detectors: 
              <input
                type="number"
                name="scanResolution"
                value={inputs.scanResolution}
                onChange={handleChange}
              />
              <button className='help-btn'
              onMouseEnter={() => setHelpButtonHoverR(true)}
              onMouseLeave={() => setHelpButtonHoverR(false)}
              >
                ?
              </button>
              {helpButtonHoverR && <div className="tooltip">This modifies the resolution of the image</div>}
            </label>
            <label>
              Number of Views Around Image: 
              <input
                type="number"
                name="sourceDistance"
                value={inputs.sourceDistance}
                onChange={handleChange}
              />
              <button className='help-btn'
              onMouseEnter={() => setHelpButtonHoverSD(true)}
              onMouseLeave={() => setHelpButtonHoverSD(false)}
              >
                ?
              </button>
              {helpButtonHoverSD && <div className="tooltip">This modifies the distance to the source</div>}
            </label>
            <label>
              Number of Iterations (average calculation): 
              <input
                type="number"
                name="detectorDistance"
                value={inputs.detectorDistance}
                onChange={handleChange}
              />
            </label>
            <label>
              Detector Width: 
              <input
                type="number"
                name="detectorWidth"
                value={inputs.detectorWidth}
                onChange={handleChange}
              />
              <button className='help-btn'
              onMouseEnter={() => setHelpButtonHoverDW(true)}
              onMouseLeave={() => setHelpButtonHoverDW(false)}
              >
                ?
              </button>
              {helpButtonHoverDW && <div className="tooltip">This modifies the size of each detector panel</div>}
            </label>
          </form>
        </div>
        <div className="technique-input">
          <b>Select Algorithm Type</b>
          <label>
            MLCM Custom Rasterization Algorithim:
            <input
              type="checkbox"
              name="mlcm"
              checked={methods.mlcm}
              onChange={handleMethodInput}
            />
          </label>
          <label>
            ASTRA CPU (not recommend sizes&gt;512):
            <input
              type="checkbox"
              name="astra"
              checked={methods.astra}
              onChange={handleCheckboxChange}
            />
          </label>
          <label>
            ASTRA GPU:
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
              onChange={handleMethodInput}
            />
          </label>
        </div>
      </div>
      <div>
        <h2>Status:</h2>
        {statusData.running ? (
          <p>Running!</p>
        ) : (
          <p>Not running.</p>
        )}
        {statusData.completed ? (
          <p>Completed!</p>
        ) : (
          <p>Not completed.</p>
        )}
        <p>Messages:</p>
        {statusData.message !== undefined ? (
          <ul>
            {statusData.message.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        ) : (
          <p>N/A</p>
        )}
        
      </div>
      <div className="results-section">
        <b>Calculation Time (ms)</b>
        <p>MLCM: {results.mlcm_time}</p>
        <p>ASTRA CPU: {results.astra_cpu_time}</p>
        <p>ASTRA GPU: {results.astra_gpu_time}</p>
        <p>TIGRE: {results.tigre_time}</p>
      </div>
      <div className='buttons'>
        <button type="submit" onClick={handleCalculate} className='submit_btns'>Calculate</button>
        <button type="about" onClick={() => setIsOpen(true)} className='submit_btns'>About</button>
        <ReactModal
          isOpen={isOpen}
          contentLabel='about-section'
          onRequestClose={() => setIsOpen(false)}
        >
          <p>Computed Tomography is an area of medical imaging that utilizies X-rays to take cross-sectional images of patients. This is a non-invasive method doctors can use to assess the internal health of patients. In order to achieve this, however, patients must be subjected to X-rays, a type of radiation, which can occasionally cause harmful side effects.</p>
          <p>The goal of this project is to make the data processing phase of Tomography more efficient by integrating hardware acceleration through the graphics pipeline. By doing this, patients would be exposed to less radiation at each visit, hopefully making the field of Tomography more safe for patients. Additionally, this could be implemented into modern machines to speed up the time of each visit.</p>
          <p>If you are interested in learning more about Computed Tomography, please visit the following link: <a href="https://www.nibib.nih.gov/science-education/science-topics/computed-tomography-ct">Computed Tomography</a></p>
          Additionally, if you would like to learn more about the toolboxes used within this project, please visit the following github repositories:
          <p>Astra toolbox: <a href="https://github.com/astra-toolbox/astra-toolbox">Astra Toolbox Repository</a></p>
          Tigre toolbox: <a href="https://github.com/CERN/TIGRE">Tigre Toolbox Repository</a>
        </ReactModal>
        <button type="reset" onClick={handleReset} className='submit_btns'>Reset</button>
      </div>
    </div>
  );
}

export default App;