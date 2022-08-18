import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  describe("Deployment", function () {});
  describe("Create", function () {
    it("Should revert if options param array doesn't have at least 1 element", async function () {});
    it("Should revert if owner is zero address", async function () {});
    it("Should create job if validation successful", async function () {});
    describe("...after job1 created", function () {
      beforeEach(`...create job1`, async function () {});
      it("Should have updated jobIds counter after create", async function () {});
      it("Should have updated s_jobs var after create", async function () {});
    });

    describe("Events", function () {
      it.only("Should emit event during create", async function () {
        this.jobManager.connect(this.sig);
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
