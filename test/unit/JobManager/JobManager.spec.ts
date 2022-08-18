import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  describe("Deployment", function () {});
  describe("Create DCA job", function () {
    it("Should revert if other validation conditions fail", async function () {});
    describe("Events", function () {
      it("Should emit event when DCA job is saved", async function () {});
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
