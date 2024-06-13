import React from "react";
import {useNavigate} from 'react-router-dom';

const Voted = (props) => {
    const navigate = useNavigate();
    const sortedParties = [...props.parties].sort((a, b) => b.voteCount - a.voteCount); //sort the parties by voteCount in descending order
    return(
        <div className="login-container">
            <h1 className="welcome-message">You have voted!</h1>
            <div class="text-left">
                <h2>Election Results:</h2>
            </div>
            <table id="myTable" className="candidates-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Party Name</th>
                        <th>Party Votes</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedParties.map((party, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{party.name}</td>
                            <td>{party.voteCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="login-button" onClick={async () => {await props.resetFunction(); navigate('/');}}>Reset Contract</button>
        </div>
    )
}

export default Voted;