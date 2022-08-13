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
      it("Should not allow non-owner to set children contract addresses", async function () {
        await expect(
          this.dCAManager
            .connect(this.signers[2])
            .setContractAddress(0, this.dCAManager.address)
        ).to.be.reverted;
      });
      it("Should allow owner to set children contract addresses", async function () {
        const testAddr = this.dCAManager.address; // dummy address
        await expect(
          this.dCAManager
            .connect(this.signers[0])
            .setContractAddress(0, testAddr)
        ).to.not.be.reverted;
        expect(await this.dCAManager.s_contractsLookup(0)).to.be.equal(
          testAddr
        );
      });
      it("Should allow owner to set children contract addresses", async function () {
        const testAddr = this.dCAManager.address; // dummy address
        await expect(
          this.dCAManager
            .connect(this.signers[0])
            .setContractAddress(3, testAddr)
        ).to.not.be.reverted;
        expect(await this.dCAManager.s_contractsLookup(3)).to.be.equal(
          testAddr
        );
      });
      it.only("Should set flag to true when all child contracts are initialized", async function () {
        const testAddr = this.dCAManager.address; // dummy address
        for (let i = 0; i < 5; i++) {
          await this.dCAManager
            .connect(this.signers[0])
            .setContractAddress(i, testAddr);
        }
        expect(await this.dCAManager.s_isInitialized()).to.be.equal(true);
      });
      it("Should revert if owner tries to set children contract address as 0", async function () {
        const testAddr = ethers.constants.AddressZero; // dummy address
        await expect(
          this.dCAManager
            .connect(this.signers[0])
            .setContractAddress(0, testAddr)
        ).to.be.reverted;
      });
      // it("Should set other initialized defaults in storage", async function () {});
      describe("Events", function () {
        it("Should emit event when a core contract address is updated", async function () {
          await expect(
            this.dCAManager
              .connect(this.signers[0])
              .setContractAddress(0, this.dCAManager.address)
          ).to.emit(this.dCAManager, "DCAManager__ContractAddrSet");
        });
      });
    });
    describe("Creating a DCA Job", function () {
      it("Should revert if attempt to create a DCA job but core contract values are not set", async function () {
        await expect(this.dCAManager.connect(this.signers[0]).createDCAJob()).to
          .be.reverted;
      });
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
