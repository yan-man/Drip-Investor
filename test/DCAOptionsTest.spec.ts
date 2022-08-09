import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DCAOptionsTest", function () {
  beforeEach(``, async function () {
    this.signers = await ethers.getSigners();
    const DCAManager = await ethers.getContractFactory("DCAManager");
    this.dCAManager = await DCAManager.deploy();
  });
  describe("Deployment", function () {
    it("Should retrieve DCA data structures from lib", async function () {});
    it("Should perform validation on DCA options", async function () {});
  });
});
