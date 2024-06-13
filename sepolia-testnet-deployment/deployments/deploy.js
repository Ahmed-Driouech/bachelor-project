import {parties,candidates} from './Parameters/parameters.js';
async function main() {
    const Voting = await ethers.getContractFactory("Voting");
    const _voting = await Voting.deploy(
      parties,
      candidates);
    console.log("Contract Deployed to Address:", _voting.address);
  }
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });