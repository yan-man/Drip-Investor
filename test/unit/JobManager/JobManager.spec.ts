import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  describe("Deployment", function () {});
  describe("Create", function () {
    it("Should revert if options param array doesn't have at least 1 element", async function () {
      await expect(
        this.jobManager
          .connect(this.signers[0])
          .create(this.signers[2].address, 1000, 100, [])
      ).to.be.reverted;
    });
    it("Should revert if owner is zero address", async function () {
      await expect(
        this.jobManager
          .connect(this.signers[0])
          .create(ethers.constants.AddressZero, 1000, 100, [])
      ).to.be.revertedWithCustomError(
        this.jobManager,
        `JobManager__InvalidOwner`
      );
    });
    it("Should create job if validation successful", async function () {});
    describe("...after job1 created", function () {
      beforeEach(`...create job1`, async function () {});
      it("Should have updated jobIds counter after create", async function () {});
      it("Should have updated s_jobs var after create", async function () {});
    });

    describe("Events", function () {
      it("Should emit event during create", async function () {
        await expect(
          this.jobManager
            .connect(this.signers[0])
            .create(this.signers[2].address, 1000, 100, [0])
        ).to.emit(this.jobManager, `LogCreate`);
      });
    });
  });
  // describe("Cancel existing DCA job", function () {
  //   it("Should revert if user has no active job", async function () {});
  //   it("Should delete the DCA job if validation successful", async function () {});
  //   describe("...After DCA job cancelled", function () {
  //     it("Should show state of user's funds and DCA job details", async function () {});
  //   });
  //   describe("Events", function () {
  //     it("Should emit event when DCA job is cancelled", async function () {});
  //   });
  // });
};
