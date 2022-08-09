import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DCAManager", function () {
  beforeEach(``, async function () {
    this.signers = await ethers.getSigners();
    const DCAManager = await ethers.getContractFactory("DCAManager");
    this.dCAManager = await DCAManager.deploy();
  });
  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      console.log(this.dCAManager);
      // expect(await dCAManager.unlockTime()).to.equal(unlockTime);
    });
    // it("Should set the right owner", async function () {
    //   const { lock, owner } = await loadFixture(deployOneYearLockFixture);
    //   expect(await lock.owner()).to.equal(owner.address);
    // });
    // it("Should receive and store the funds to lock", async function () {
    //   const { lock, lockedAmount } = await loadFixture(
    //     deployOneYearLockFixture
    //   );
    //   expect(await ethers.provider.getBalance(lock.address)).to.equal(
    //     lockedAmount
    //   );
    // });
    // it("Should fail if the unlockTime is not in the future", async function () {
    //   // We don't use the fixture here because we want a different deployment
    //   const latestTime = await time.latest();
    //   const Lock = await ethers.getContractFactory("Lock");
    //   await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
    //     "Unlock time should be in the future"
    //   );
    // });
  });
});
