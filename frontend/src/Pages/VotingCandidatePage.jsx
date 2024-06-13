import React from "react";
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const VotingCandidate = (props) => {
    const navigate = useNavigate();
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    function handleRadioChange(index){
        setSelectedCandidate(index);
    }
    
    function handleVoteClick(){
        if(selectedCandidate !== null){
            props.voteFunction(selectedCandidate);
        }
        else{
            alert("please select a candidate!");
        }
    }
    return(
        <div className="connected-container">
            <h1 className="connected-header">Metamask Connected!</h1>
            <p className="connected-account">Wallet Address: {props.account}</p>
      
            {props.showButton ? 
                (<p className="connected-account">Your vote has been registered!</p>)
                : 
                (
                <div className= "text-left">
                    <h2>Choose a candidate: </h2>
                </div>
                )}
            <div className="candidates-table-wrapper">
                <table id="myTable" className="candidates-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Candidate Name</th>
                            <th>Candidate Party</th>
                            <th>Candidate Votes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.candidates.map((candidate, index) => (
                            <tr key={index}>
                                <td>   
                                    <label className="radio-container">
                                        <input 
                                            type="radio" 
                                            name="candidate" 
                                            value={candidate.index} 
                                            checked={selectedCandidate === candidate.index}
                                            onChange={() => handleRadioChange(candidate.index)} 
                                            />
                                            <span className="checkmark"></span>
                                    </label>
                                </td>
                                <td>{candidate.name}</td>
                                <td>{candidate.party}</td>
                                <td>{candidate.voteCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br/>
            
            {props.showButton ? 
                (<button className="login-button" onClick={() => navigate('/Voted')}>Next</button>) 
                : 
                (
                <div>
                    <button className="login-button" onClick={handleVoteClick}>Vote</button>
                </div>
                )}
        </div>
    )
}

export default VotingCandidate;