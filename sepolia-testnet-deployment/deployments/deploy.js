async function main() {
    const Voting = await ethers.getContractFactory("Voting");
    const _voting = await Voting.deploy(
      ["VVD", "PVV", "D66", "DENK"],
      [["Mark Rutte", "VVD"], ["Geert Wilders", "PVV"], ["Rob Jetten", "D66"], ["Stephan van Baarlen", "DENK"]]);
    console.log("Contract Deployed to Address:", _voting.address);
  }
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });