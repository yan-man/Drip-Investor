import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  describe("Deployment", function () {
    // it("Should set the right owner", async function () {
    //   // expect(await this.dCAManager.owner()).to.equal(this.signers[0].address);
    // });
    it("Should set JobManager address", async function () {
      await expect(this.keepersManager.setJobManager(this.signers[1].address))
        .to.not.be.reverted;
    });
    // it("Should set the right owner", async function () {});
    // it("Should set the right owner", async function () {});
    // it("Should set the right owner", async function () {});
    // it("Should set the right owner", async function () {});
  });
};
