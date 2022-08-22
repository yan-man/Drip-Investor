import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  describe("Initialization", function () {
    it("Should set lending pool details in constructor", async function () {
      expect(await this.lendingManager.s_lendingPool()).to.be.equal(
        this.mocks.mockILendingPool.address
      );
      expect(await this.lendingManager.s_provider()).to.be.equal(
        this.mocks.mockILendingPoolAddressesProvider.address
      );
    });
  });
  describe("Lending Manager", function () {
    // it("Should allow setting the LendingPool address", async function () {});
    // it("Should set the lending pool and  provider on construction", async function () {});
    // it("Should not allow deposit if not initialized", async function () {});
    // it("Should allow setting the token address (ie usdc)", async function () {});
    // it("Should revert if necessary addresses aren't initialized", async function () {});

    // it("Should set the lending pool and provider on construction", async function () {});
    // it("Should allow ", async function () {});
    // it("Should set the lending pool and  provider on construction", async function () {});
    // it("Should set the lending pool and  provider on construction", async function () {});
    // it("Should set the lending pool and  provider on construction", async function () {});
    describe("Events", function () {
      it("Should emit event LogDeposit when deposited into lender", async function () {});
    });
  });
};