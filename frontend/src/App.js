import {useState, useEffect} from 'react';
import {BrowserRouter,Routes, Route, Navigate} from 'react-router-dom';
import {contractAbi, contractAddress } from './Constant/constants';
import Login from './Pages/LoginPage'; 
import VotingParty from './Pages/VotingPartyPage'; 
import VotingCandidate from './Pages/VotingCandidatePage'; 
import Voted from './Pages/Voted'; 
import './App.css';

function App() 
{
  const { ethers } = require("ethers");
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [parties, setParties] = useState([]);
  const [partyIndex, setPartyIndex] = useState("");
  const [votedParty, setVotedParty] = useState(false);
  const [votedCandidate, setVotedCandidate] = useState(false);

  useEffect(() => 
    {
      setPartyVoteStatus();
      if(votedParty)
      {
        getPartyIndex();        
      }

      if(partyIndex !== "")
      {
        getAllCandidates(partyIndex);
      }
      getAllParties();

      if(window.ethereum)
      {
        window.ethereum.on("accountsChanged", handleAccountsChanged); //check whether user has switched accounts
      }
        return() => 
        {
          if(window.ethereum)
          {
            window.ethereum.removeListener("accountsChanged", handleAccountsChanged); //remove accountsChanged listener once the accounts are changed
          }
              
        }
    },[votedParty, partyIndex, account]);
          
  async function getContractInstance()
  {
    if(window.ethereum)
    {
      const provider =  new ethers.BrowserProvider(window.ethereum); //check the provider
      await provider.send("eth_requestAccounts",[]); //request the users accounts from the provider
      const signer = await provider.getSigner(); //get address of current connected account
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer); // get instance of the voting smart contract
      
      return contractInstance;
    }
    else
    {
      return(console.log("Metamask not found!"));
    }
  }

  async function voteParty(_partyIndex)
  {
    const contractInstance = await getContractInstance();
    const transaction = await contractInstance.voteParty(_partyIndex);
    await transaction.wait();
    setPartyIndex(_partyIndex);
    setPartyVoteStatus();
  }

  async function voteCandidate(_candidateIndex)
  {
    const contractInstance = await getContractInstance();
    const transaction = await contractInstance.voteCandidate(_candidateIndex, partyIndex);
    await transaction.wait();
    setCandidateVoteStatus();
  }

  async function setPartyVoteStatus()
  {
    const provider =  new ethers.BrowserProvider(window.ethereum); //check the provider
    await provider.send("eth_requestAccounts",[]); //request the users accounts from the provider
    const signer = await provider.getSigner(); //get address of current connected account
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer); // get instance of the voting smart contract
    const voteStatus = await contractInstance.votedParty(await signer.getAddress());
    setVotedParty(voteStatus);
  }

  async function setCandidateVoteStatus()
  {
    const provider =  new ethers.BrowserProvider(window.ethereum); //check the provider
    await provider.send("eth_requestAccounts",[]); //request the users accounts from the provider
    const signer = await provider.getSigner(); //get address of current connected account
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer); // get instance of the voting smart contract
    const voteStatus = await contractInstance.votedCandidate(await signer.getAddress());
    setVotedCandidate(voteStatus);
  }


  async function getPartyIndex()
  {
    const provider =  new ethers.BrowserProvider(window.ethereum); //check the provider
    await provider.send("eth_requestAccounts",[]); //request the users accounts from the provider
    const signer = await provider.getSigner(); //get address of current connected account
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer); // get instance of the voting smart contract
    const index = contractInstance.partyIndex(await signer.getAddress());
    setPartyIndex(index);
  }

  async function getAllParties()
  {
    const contractInstance = await getContractInstance();
    const partyList = await contractInstance.getAllParties();
    const formattedPartyList = partyList.map((party, partyIndex) => {
      return {
        index: partyIndex,
        name: party.name,
        voteCount: party.voteCount.toString()
      }
    });
    setParties(formattedPartyList);
  }

  async function getAllCandidates(partyIndex)
  {
    const contractInstance = await getContractInstance();
    const candidatesList = await contractInstance.getAllCandidates(partyIndex);
    const formattedCandidatesList = candidatesList.map((candidate, candidateIndex) => {
      return {
        index: candidateIndex,
        name: candidate.name,
        party: candidate.party,
        voteCount: candidate.voteCount.toString()
      }
    });
    setCandidates(formattedCandidatesList);
  }

  function handleAccountsChanged(accounts)
  {
    if(accounts.length > 0 && account !== accounts[0]) //check whether account is set to the current account thats logged in
    {
      setAccount(accounts[0]);
      setPartyVoteStatus();
      setCandidateVoteStatus();
    }
    else
    {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask()
  {
    if(window.ethereum) //check whether any wallet is installed
    {
      try
      {
        const provider =  new ethers.BrowserProvider(window.ethereum) //check the provider
        setProvider(provider);
        await provider.send("eth_requestAccounts",[]); //request the users accounts from the provider
        const signer = await provider.getSigner(); //get current connected account
        const address = (await signer).address; //get wallet address of current account
        setAccount(address);
        setIsConnected(true);
        setPartyVoteStatus();
        setCandidateVoteStatus();
      }
      catch(err)
      {
        console.error(err);
      }
    }
    else
    {
      console.error("Metamask wallet not detected in browser...")
    }
  }

async function resetContract()
{
  const contractInstance = await getContractInstance();
  await contractInstance.resetContract();
}

  return (
    <div className="App">
     {isConnected ? ( 
                    <BrowserRouter>
                      <Routes>
                        <Route index element={
                          <VotingParty 
                          account = {account}
                          parties = {parties}
                          voteFunction = {voteParty}
                          showButton = {votedParty}/>}
                          />
                        <Route path='/VotingCandidate' element={
                          votedParty ? 
                          <VotingCandidate
                          account = {account}
                          candidates = {candidates}
                          voteFunction = {voteCandidate}
                          showButton = {votedCandidate}/> 
                          : 
                          <Navigate to="/" replace/>}
                          />
                        <Route path='/Voted' element={
                          votedParty ? 
                          <Voted 
                          resetFunction = {resetContract}
                          parties = {parties}/> 
                          : 
                          <Navigate to="/" replace/>}/>
                      </Routes>
                    </BrowserRouter>                 
                    )
                    : 
                    (<Login connectWallet = {connectToMetamask}/>)}
    </div>
  );
}

export default App;