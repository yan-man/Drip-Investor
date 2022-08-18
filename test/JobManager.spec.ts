import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

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
  });
  describe("Create DCA job", function () {
    it("Should revert if other validation conditions fail", async function () {});
    it("Should allow any user to create a DCA job if validation conditions met", async function () {});
    describe("Events", function () {
      it("Should emit event when DCA job is saved", async function () {});
    });
    describe("...After DCA job created", function () {
      it("Should allow user to create a 2nd DCA job with valid DCA parameters", async function () {});
      it("Should allow user2 to create a DCA job with valid DCA parameters", async function () {});
      it("Should show state of user's funds and DCA job details", async function () {});
    });
  });
  describe("Cancel existing DCA job", function () {
    it("Should revert if user has no active job", async function () {});
    it("Should delete the DCA job if validation successful", async function () {});
    describe("...After DCA job cancelled", function () {
      it("Should show state of user's funds and DCA job details", async function () {});
    });
    describe("Events", function () {
      it("Should emit event when DCA job is cancelled", async function () {});
    });
  });
});
