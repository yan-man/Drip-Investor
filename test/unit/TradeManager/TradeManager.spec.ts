import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  describe("Job Manager", function () {
    beforeEach(``, async function () {
      this.signers = await ethers.getSigners();
      // const DCAManager = await ethers.getContractFactory("DCAManager");
      // this.dCAManager = await DCAManager.deploy();
    });
    describe("Deployment", function () {
      it("Should set the right owner", async function () {
        // expect(await this.dCAManager.owner()).to.equal(this.signers[0].address);
      });
      it("Should set the right owner", async function () {});
      it("Should set the right owner", async function () {});
      it("Should set the right owner", async function () {});
      it("Should set the right owner", async function () {});
      it("Should set the right owner", async function () {});
    });
  });
};
