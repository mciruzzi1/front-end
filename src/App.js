import React, { useState } from 'react';
import './App.css';
import ReactModal from 'react-modal';

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
    setInputs({ ...inputs, [name]: value });
  };

  //Change the methods used as the user updates them
  const handleMethodInput = (e) => {
    const { name, checked } = e.target;
    setMethods({ ...methods, [name]: checked });
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    // call the api and update results here
  };

  //Set each value back to its original state
  const handleReset = (e) =>{
    setInputs({
      views: '',
      beams: '',
      scanResolution: '',
      sourceDistance: '',
      detectorDistance: '',
      detectorWidth: '',
    });

    setMethods({
      mlcm: false,
      astra: false,
      mirt: false,
      tigre: false,
    });
  }

  return (
    <div className="app">
      <div className="user-input">
        <div className="data-input">
          <form className = "data-form" onSubmit={handleCalculate}>
            <label>
              Views: 
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
              {helpButtonHoverV && <div className="tooltip">This modifies the number of views used</div>}
            </label>
            <label>
              Beams: 
              <input
                type="number"
                name="beams"
                value={inputs.beams}
                onChange={handleDataInput}
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
              Scan Resolution: 
              <input
                type="number"
                name="scanResolution"
                value={inputs.scanResolution}
                onChange={handleDataInput}
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
              Source Distance: 
              <input
                type="number"
                name="sourceDistance"
                value={inputs.sourceDistance}
                onChange={handleDataInput}
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
              Detector Distance: 
              <input
                type="number"
                name="detectorDistance"
                value={inputs.detectorDistance}
                onChange={handleDataInput}
              />
              <button className='help-btn'
              onMouseEnter={() => setHelpButtonHoverDD(true)}
              onMouseLeave={() => setHelpButtonHoverDD(false)}
              >
                ?
              </button>
              {helpButtonHoverDD && <div className="tooltip">This modifies the distance between each detector</div>}
            </label>
            <label>
              Detector Width: 
              <input
                type="number"
                name="detectorWidth"
                value={inputs.detectorWidth}
                onChange={handleDataInput}
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
          <label>
            MLCM Rasterization Algorithim:
            <input
              type="checkbox"
              name="mlcm"
              checked={methods.mlcm}
              onChange={handleMethodInput}
            />
          </label>
          <label>
            ASTRA Toolkit:
            <input
              type="checkbox"
              name="astra"
              checked={methods.astra}
              onChange={handleMethodInput}
            />
          </label>
          <label>
            MIRT:
            <input
              type="checkbox"
              name="mirt"
              checked={methods.mirt}
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
      <div className="results-section">
        <p>MLCM Time: {results.mlcmTime}</p>
        <p>ASTRA Time: {results.astraTime}</p>
        <p>MIRT Time: {results.mirtTime}</p>
        <p>TIGRE Time: {results.tigreTime}</p>
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