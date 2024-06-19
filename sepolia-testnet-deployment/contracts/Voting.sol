pragma solidity >=0.8.18;

contract Voting{
    struct Party{
        string name;
        Candidate[] partyCandidates;
        uint256 voteCount;
    }

    struct Candidate {
        string name;
        uint256 voteCount;
        string party;
    }

    Party[] public parties; 
    address owner;
    mapping(address => bool) public votedParty;
    mapping(address => bool) public votedCandidate;
    mapping(address => uint256) public partyIndex; //save the party index for the frontend logic
    address[] voters; //record a voters list to be able to reset the contract for testing purposes

constructor(string[] memory _parties, string[][] memory _candidateNames) {
    //add all the parties
    for (uint256 i = 0; i < _parties.length; i++){
        Party storage newParty = parties.push();
        newParty.name =  _parties[i];
        newParty.voteCount = 0;
    }
    
    //add all the candidates
    for (uint256 i = 0; i < _candidateNames.length; i++) {
        Candidate memory newCandidate = Candidate({
            name: _candidateNames[i][0],
            voteCount: 0,
            party: _candidateNames[i][1]
        });
        
        //add the candidates to their respective partylist
        for(uint j = 0; j < parties.length; j++){
            if(keccak256(abi.encodePacked(parties[j].name)) == keccak256(abi.encodePacked(newCandidate.party))){
                parties[j].partyCandidates.push(newCandidate);
                break;
            }
        }
    }
    owner = msg.sender;
}

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function resetContract() public onlyOwner {
        //reset vote status of all the voters
        for (uint i = 0; i < voters.length; i++) {
            votedParty[voters[i]] = false;
            votedCandidate[voters[i]] = false;
            partyIndex[voters[i]] = 0;
        }

        //reset votecounts of all the parties and their candidates
        for(uint j = 0; j < parties.length; j++){
            parties[j].voteCount = 0; //reset the voteCount of all parties

            for(uint k = 0; k < parties[j].partyCandidates.length; k++){
                parties[j].partyCandidates[k].voteCount = 0; //reset the voteCount of all candidates in the party
            }
        }
        
    }

    function voteParty(uint256 _partyIndex) public {
        require(!votedParty[msg.sender], "You have already voted on a party.");

        parties[_partyIndex].voteCount++;
        votedParty[msg.sender] = true;
        partyIndex[msg.sender] = _partyIndex;
        voters.push(msg.sender); 
    }

    function voteCandidate(uint256 _candidateIndex, uint256 _partyIndex) public {
        require(!votedCandidate[msg.sender], "You have already voted for a candidate.");

        parties[_partyIndex].partyCandidates[_candidateIndex].voteCount++;
        votedCandidate[msg.sender] = true;
    }

    function getAllParties() public view returns (Party[] memory){
        return parties;
    }

    function getAllCandidates(uint256 _partyIndex) public view returns (Candidate[] memory){
        return parties[_partyIndex].partyCandidates;
    }
}