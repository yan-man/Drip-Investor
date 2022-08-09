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
    describe("State variables/Owner privileges", function () {
      it("Should set the right owner", async function () {
        expect(await this.dCAManager.owner()).to.equal(this.signers[0].address);
      });
      it("Should allow owner to set children contract addresses", async function () {});
      it("Should allow users to retrieve core contract addresses", async function () {});
      it("Should set other initialized defaults in storage", async function () {});
      describe("Events", function () {
        it("Should emit event for ownership transfer during deployment", async function () {});
        it("Should emit event when a core contract address is updated", async function () {});
      });
    });
    describe("Creating a DCA Job", function () {
      it("Should revert if attempt to create a DCA job but core contract values are not set", async function () {});
      it("Should revert if token transfer not approved first", async function () {});
      it("Should revert if no tokens are sent/user has insufficient tokens", async function () {});
      it("Should revert if invalid tokens are sent with request", async function () {});
      it("Should call JobManager createDCAJob function if validation successful", async function () {});
      describe("Events", function () {
        it("Should emit event when valid DCA job is created", async function () {});
      });
      describe("...after DCA job1 saved", function () {
        it("Should have expected tokens in contract after DCA job created", async function () {});
      });
    });
  });
  describe("Events", function () {
    it("Should emit even when user creates a DCA job", async function () {});
    it("Should set the right owner", async function () {});
    it("Should set the right owner", async function () {});
  });
});
