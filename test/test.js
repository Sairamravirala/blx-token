const { expect } = require("chai");

describe("BLXToken", function () {
  it("should mint tokens and update balance", async function () {
    const [owner] = await ethers.getSigners();
    const BLX = await ethers.getContractFactory("BLXToken");
    const token = await BLX.deploy();
    await token.mint(owner.address, 1000);

    expect(await token.balanceOf(owner.address)).to.equal(1000);
  });
});
