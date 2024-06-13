import React from "react";
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

const VotingParty = (props) => {
    const navigate = useNavigate();
    const [selectedParty, setSelectedParty] = useState(null);

    function handleRadioChange(index){
        setSelectedParty(index);
    }
    
    function handleVoteClick(){
        if(selectedParty !== null){
            props.voteFunction(selectedParty);
        }
        else{
            alert("please select a party!");
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
                    <h2>Choose a party: </h2>
                </div>
                )}
            <div className="candidates-table-wrapper">
                <table id="myTable" className="candidates-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Party Name</th>
                            <th>Party Votes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.parties.map((party, index) => (
                            <tr key={index}>
                                <td>
                                    <label className="radio-container">
                                        <input 
                                            type="radio" 
                                            name="party" 
                                            value={party.index} 
                                            checked={selectedParty === party.index}
                                            onChange={() => handleRadioChange(party.index)} 
                                            />
                                        <span className="checkmark"></span>
                                    </label>
                                </td>
                                <td>{party.name}</td>
                                <td>{party.voteCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br/>

            {props.showButton ? 
                (<button className="login-button" onClick={() => navigate('/VotingCandidate')}>Next</button>) 
                : 
                (
                <div>
                    <button className="login-button" onClick={handleVoteClick}>Vote</button>
                </div>
                )}

        </div>
    )
}

export default VotingParty;