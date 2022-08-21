import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  describe("Initialization", function () {
    it("Should allow setting core contract addresses", async function () {
      await expect(
        this.tradeManager.setTradingContractAddresses(
          this.mocks.mockLendingManager.address,
          this.mocks.mockDEXManager.address,
          this.mocks.mockJobManager.address
        )
      ).to.be.not.reverted;
    });
    it("Should revert deposit if not yet initialized", async function () {
      await expect(this.tradeManager.deposit(0)).to.be.revertedWithCustomError(
        this.tradeManager,
        `TradeManager__NotInitialized`
      );
    });
    it("Should revert swap if not yet initialized", async function () {
      await expect(this.tradeManager.swap(0)).to.be.revertedWithCustomError(
        this.tradeManager,
        `TradeManager__NotInitialized`
      );
    });
    describe("...After initialization", function () {
      beforeEach(`set trading contract addresses`, async function () {
        await this.tradeManager.setTradingContractAddresses(
          this.mocks.mockLendingManager.address,
          this.mocks.mockDEXManager.address,
          this.mocks.mockJobManager.address
        );
      });
      it("Should not allow deposit for invalid Id", async function () {
        await this.mocks.mockJobManager.mock.isValidId.returns(false);
        await expect(
          this.tradeManager.deposit(0)
        ).to.be.revertedWithCustomError(
          this.tradeManager,
          `TradeManager__InvalidId`
        );
      });
      it("Should allow deposit for Id", async function () {
        await this.mocks.mockJobManager.mock.isValidId.returns(true);
        await this.mocks.mockJobManager.mock.s_jobs.returns(
          ethers.BigNumber.from("0"),
          this.signers[4].address,
          ethers.BigNumber.from("0"),
          true,
          ethers.BigNumber.from("1661074126"),
          ethers.BigNumber.from("100")
        );
        await expect(this.tradeManager.deposit(0)).to.be.not.reverted;
      });
    });
    // it("Should set the right owner", async function () {});
    // it("Should set the right owner", async function () {});
    // it("Should set the right owner", async function () {});
    // it("Should set the right owner", async function () {});
  });
};
