const { ethers } = require("hardhat");

async function main() {
  const BLXToken = await ethers.getContractFactory("BLXToken");
  const blx = await BLXToken.deploy();

  await blx.deployed();
  console.log("BLX Token deployed to:", blx.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
