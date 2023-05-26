import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/types';
import store from '../../redux/store';
import { fetchLabs } from '../../redux/actions/labs';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GetImage from '../../hook/image';
import useCreate from '../../hook/labCreate';
import axios from "axios";
import './Popup.css';
import Resource from '../../component/resource';
import LabPlanDropdown from '../../component/lpdown';
import NewLP from '../../component/newLP';

interface PopupProps {
  show: boolean;
  item: any;
  handleClose: () => void;
}
type AllowedRegion = {
  name: string;
  displayName: string;
};
const Popup: React.FC<PopupProps> = ({ show, item, handleClose }) => {
  const labplans = useSelector((state: AppState) => state.labPlans.data);
  const rgs  = useSelector((state: AppState) => state.rgs.data);
  const labs = useSelector((state: AppState) => state.labs.data);
  const accessToken = useSelector((state: AppState) => state.token.accessToken);
  const [labTitle, setLabTitle] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [students, setStudents] = useState('');
  const [isCustomizeChecked, setIsCustomizeChecked] = useState(false);
  const [selectedLP, setselectedLP] = useState('');
  const selectedLabPlan = labplans?.find((labplan) => labplan.id.name === selectedLP);
  const allowedRegions = selectedLabPlan?.data.allowedRegions || [];
  const [selectedRegion, setSelectedRegion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [newLP, setShowNewLP] = useState(false);
  const [selectedRG, setSelectedRG] = useState('');
  const [inputRG, setInputRG] = useState("");
  
  const [ newLPtitle, setNewLPtitle] = useState('');
  const [showRG, setShowRG] = useState(false);

  const [custom, setCustom] = useState(true);
  

  const apiData = accessToken && labplans ? GetImage(item, accessToken, labplans) : null;
  const osType = apiData?.data.osType;
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<AppState, unknown, any>>();


  const [labexist, setLabexist] =useState("");
  const handleLabTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLabTitle(value);
    const labExists = labs?.some((lab) => lab.title === value);  // check if the lab title already exists in labs
    if (labExists) {
      setLabexist("There is already a lab with this title");
    } else {
      setLabexist("");
    }
  };

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
  };
  const handleLPChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setselectedLP(event.target.value);
  };

  const [csvData, setCsvData] = useState<string | null>(null);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCsvData(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  const [showContent2, setShowContent2] = useState(false);
  const handleNextClick = () => {
    setShowContent2(true);
  };
  const handleBackClick = () => {
    setShowContent2(false);
  };


  useEffect(() => {
    if (!show) {
      setLabTitle('');
      setLogin('');
      setPassword('');
      setStudents('');
      setIsCustomizeChecked(false);
      setShowContent2(false);
      setselectedLP('');
      setSelectedRegion('');
      setCsvData('');
      setSubmitClicked(false);
      setLabexist('');
    }
  }, [show]);
  
  useEffect(() => {
    if (passwordTouched) { // Only check password if password input field has been interacted with
      if (password.length < 8 || password.length > 123) {
        setErrorMessage("Password must be between 8~123 characters.");
      } else if (
        !(
          /[a-z]/.test(password) &&
          /[A-Z]/.test(password) &&
          /\d/.test(password) &&
          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)
        )
      ) {
        setErrorMessage(
          "Password must include 3 of the following: a number, uppercase character, lowercase character, or a special character."
        );
      } else {
        setErrorMessage("");
      }
    }
  }, [password, passwordTouched]);
  

  
  const [submitClicked, setSubmitClicked] = useState(false);
  const handleSubmit = () => {
    if (csvData) {
      localStorage.setItem(`csvData_${labTitle}`, csvData);
    }
    setSubmitClicked(true);
    setTimeout(() => {
      if (accessToken) {
        dispatch(fetchLabs(accessToken))
      }
      navigate(`/track/${selectedLabPlan?.id.parent.parent.name}/${selectedLabPlan?.id.parent.name}/${labTitle}`);
    }, 3000);
    
  };

  useCreate({
    submitClicked,
    accessToken,
    apiData,
    labplans,
    selectedLP,
    labTitle,
    login,
    password,
    students,
    isCustomizeChecked,
    selectedRegion,
    csvData,
    imageName: item?.identifier,
    item,
    region: selectedRegion
  })

  useEffect(() => {
    if (allowedRegions.length === 1) {
        setSelectedRegion(allowedRegions[0].name);
    }
}, [allowedRegions]);

  return (
    <div className={`popup ${show ? "popup-show" : ""}`} onClick={handleBackgroundClick}>
      <div className="popup-content" style={{ display: showContent2 ? "none" : "block" }}>
        <div className="popup-header">
          <img src={apiData?.data.iconUri} alt={item?.title} />
          <button className="popup-close" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="popup-body">
          <h2>{item?.title}</h2>
          <p style={{display: "none"}}>{item?.identifier}</p>
          <p style={{display: "none"}}>{item?.advanced}</p>
          <p dangerouslySetInnerHTML={{ __html: apiData?.data.description }}></p>
        </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <p>{labplans && <LabPlanDropdown selectedLP={selectedLP} labplans={labplans} handleLPChange={handleLPChange} />} <button onClick={() => setShowNewLP(true)}>New</button></p>
          </div>
          {newLP && 
            <NewLP 
              rgs={rgs} 
              selectedRG={selectedRG}
              newLPtitle={newLPtitle}
              setSelectedRG={setSelectedRG}
              setNewLPtitle={setNewLPtitle}
              selectedRegion={selectedRegion} 
              setSelectedRegion={setSelectedRegion} 
              setShowNewLP={setShowNewLP} 
              inputRG={inputRG}
              setInputRG={setInputRG}
              setselectedLP={setselectedLP}
            />
          }
          
        <div>
        <p>
        <label>
          Lab Title: 
          <input type="text" value={labTitle} onChange={handleLabTitle} />
        </label>
        </p>
        <p>{labexist && <span style={{color: 'red'}}>{labexist}</span>}</p>

              <p>Region:
                {allowedRegions.length === 1 ? (
                  <span>{allowedRegions[0].displayName}</span>
                ) : (
                  <select value={selectedRegion} onChange={handleRegionChange}>
                    <option value="">Select a region</option>
                    {allowedRegions.map((region: AllowedRegion, index: number) => (
                      <option key={index} value={region.name}>
                        {region.displayName}
                      </option>
                    ))}
                  </select>
                )}
            </p>


              <p><label>Login: <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} /></label></p>
              <p><label>Password: <input
            type="password"
            value={password}
            onChange={(e) => {
              setPasswordTouched(true); // User has interacted with password input field
              setPassword(e.target.value);
            }}
          /></label></p>
              {passwordTouched ? <p>{errorMessage}</p> : null}

              <p><label>Students: <input type="text" value={students} onChange={(e) => setStudents(e.target.value)} /></label></p>
            </div>
            <div className="customize-section">
              <p className="customize-text">Customize?</p>
              <div className="radio-buttons">
                <label className="radio-label">
                  <input type="radio" value="yes" checked={isCustomizeChecked} onChange={() => setIsCustomizeChecked(true)} />
                  Yes
                </label>
                <label className="radio-label">
                  <input type="radio" value="no" checked={!isCustomizeChecked} onChange={() => setIsCustomizeChecked(false)} />
                  No
                </label>
              </div>
            </div>

            <Resource students = {students} selectedLP={selectedLP} selectedRegion={selectedRegion} osType = {osType} />
<div className='popup-button'>
            <button className="popup-next" onClick={handleNextClick}
            disabled={!labTitle || !login || !password || !students || !selectedLP}>
          Next
        </button>
        </div>
          
      </div>
      <div className="popup-content2" style={{ display: showContent2 ? "block" : "none" }}>
        <div className="popup-header">
          <h2>User Invitation</h2>
          <button className="popup-close" onClick={handleClose}>
            &times;
          </button>
        </div>
        <button className="popup-close" onClick={handleClose}></button>
        <div className="email-list-container">
        <label htmlFor="emailList">Email List:</label>
        <textarea
          id="emailList"
          value={csvData || ""}
          placeholder="Paste a list of emails here..."
          onChange={(e) => setCsvData(e.target.value)}
        />
      </div>
      <div className="csv-file-container">
      <label htmlFor="csvFile">CSV File:</label>
      <input
        type="file"
        id="csvFile"
        accept=".csv"
        onChange={handleFileUpload}
      />
    </div>
        <button className="popup-back" onClick={handleBackClick}>
          Back
        </button>
        <p>If you want to invite user urself please click slip</p>
        <p>You would have to publish and invite user urself</p>
        <button className="submit-button skip">Skip</button>
        <button className="submit-button">Skip</button>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
        <p>{csvData? csvData : null}</p>
      </div>
    </div>
  );
};

export default Popup;