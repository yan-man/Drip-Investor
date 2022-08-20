import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  describe("Deployment", function () {
    it("Should revert if checkUpkeep attempted prior to initializing JobManager", async function () {
      await expect(
        this.keepersManager.checkUpkeep(ethers.utils.formatBytes32String(""))
      ).to.be.revertedWith("JobManager not set");
    });
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
