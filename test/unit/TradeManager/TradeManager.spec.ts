import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  describe("Initialization", function () {
    it.only("Should allow setting core contract addresses", async function () {
      await expect(
        this.tradeManager.setTradingContractAddresses(
          this.mocks.mockLendingManager.address,
          this.mocks.mockDEXManager.address,
          this.mocks.mockJobManager.address
        )
      ).to.be.not.reverted;
    });
    it("Should revert deposit if not yet initialized", async function () {
      expect(await this.tradeManager.setTradingContractAddresses()).to.equal(
        this.signers[0].address
      );
    });
    it("Should revert swap if not yet initialized", async function () {
      expect(await this.tradeManager.setTradingContractAddresses()).to.equal(
        this.signers[0].address
      );
    });
    // it("Should set the right owner", async function () {});
    // it("Should set the right owner", async function () {});
    // it("Should set the right owner", async function () {});
    // it("Should set the right owner", async function () {});
  });
};
