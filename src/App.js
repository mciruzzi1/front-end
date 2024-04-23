import React, { useState, useEffect } from 'react';
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

  const[helpButtonHoverS, setHelpButtonHoverS] = useState(false);
  const[helpButtonHoverDist, setHelpButtonHoverDist] = useState(false);
  const[helpButtonHoverDet, setHelpButtonHoverDet] = useState(false);
  const[helpButtonHoverV, setHelpButtonHoverV] = useState(false);
  const[helpButtonHoverI, setHelpButtonHoverI] = useState(false);

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
          <form className = "data-form" onSubmit={handleCalculate}>
            <label>
              Size: 
              <input
                type="number"
                name="size"
                value={inputs.size}
                onChange={handleDataInput}
              />
              <button className='help-btn'
              onMouseEnter={() => setHelpButtonHoverS(true)}
              onMouseLeave={() => setHelpButtonHoverS(false)}
              >
                ?
              </button>
              {helpButtonHoverS && <div className="tooltip">This modifies the size of the image</div>}
            </label>
            <label>
              Source & Detector Distance: 
              <input
                type="number"
                name="distance"
                value={inputs.distance}
                onChange={handleDataInput}
              />
              <button className='help-btn'
              onMouseEnter={() => setHelpButtonHoverDist(true)}
              onMouseLeave={() => setHelpButtonHoverDist(false)}
              >
                ?
              </button>
              {helpButtonHoverDist && <div className="tooltip">Distance to the source and detectors</div>}
            </label>
            <label>
              Number of Detectors: 
              <input
                type="number"
                name="detectors"
                value={inputs.detectors}
                onChange={handleDataInput}
              />
              <button className='help-btn'
              onMouseEnter={() => setHelpButtonHoverDet(true)}
              onMouseLeave={() => setHelpButtonHoverDet(false)}
              >
                ?
              </button>
              {helpButtonHoverDet && <div className="tooltip">Number of detectors</div>}
            </label>
            <label>
              Number of Views Around Image: 
              <input
                type="number"
                name="views"
                value={inputs.views}
                onChange={handleDataInput}
              />
              <button className='help-btn'
              onMouseEnter={() => setHelpButtonHoverV(true)}
              onMouseLeave={() => setHelpButtonHoverV(false)}
              >
                ?
              </button>
              {helpButtonHoverV && <div className="tooltip">Number of views around the image</div>}
            </label>
            <label>
              Number of Iterations (average calculation): 
              <input
                type="number"
                name="iterations"
                value={inputs.iterations}
                onChange={handleDataInput}
              />
              <button className='help-btn'
              onMouseEnter={() => setHelpButtonHoverI(true)}
              onMouseLeave={() => setHelpButtonHoverI(false)}
              >
                ?
              </button>
              {helpButtonHoverI && <div className="tooltip">For average calculation</div>}
            </label>
          </form>
        </div>
        <div className="technique-input">
          <b>Select Algorithm Type</b>
          <label>
            MLCM Custom:
            <input
              type="checkbox"
              name="mlcm"
              checked={methods.mlcm}
              onChange={handleMethodInput}
            />
          </label>
          <label>
            ASTRA CPU:
            <input
              type="checkbox"
              name="astra_cpu"
              checked={methods.astra_cpu}
              onChange={handleMethodInput}
            />
          </label>
          <label>
            ASTRA GPU:
            <input
              type="checkbox"
              name="astra_gpu"
              checked={methods.astra_gpu}
              onChange={handleMethodInput}
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
      <div className="status-section">
        <b>Status:</b>
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