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
  describe("setDepositToken", function () {
    it("Should set the Deposit token address", async function () {
      await expect(
        this.lendingManager.setDepositToken(this.mocks.mockUsdc.address)
      ).to.be.not.reverted;
    });
    describe("Events", function () {
      it("Should emit when deposit token address set", async function () {
        await expect(
          this.lendingManager.setDepositToken(this.mocks.mockUsdc.address)
        )
          .to.emit(this.lendingManager, `LogSetDepositTokenAddress`)
          .withArgs(this.mocks.mockUsdc.address);
      });
    });
  });
  describe("deposit", function () {
    it("Should revert if not initialized", async function () {
      await expect(this.lendingManager.deposit(this.signers[4].address, 100)).to
        .be.reverted;
    });

    describe("...After initialization", function () {
      beforeEach(`...set mock contract address`, async function () {
        await this.lendingManager.setDepositToken(this.mocks.mockUsdc.address);
      });
      it("Should emit when deposit", async function () {
        await expect(this.lendingManager.deposit(this.signers[4].address, 100))
          .to.emit(this.lendingManager, `LogDeposit`)
          .withArgs(this.signers[4].address, 100);
      });
    });
  });
  describe("withdraw", function () {
    it("Should revert if not initialized", async function () {
      await expect(this.lendingManager.withdraw(this.signers[4].address, 100))
        .to.be.reverted;
    });

    describe("...After initialization", function () {
      beforeEach(`...set mock contract address`, async function () {
        await this.lendingManager.setDepositToken(this.mocks.mockUsdc.address);
      });
      it("Should emit when withdrawal", async function () {
        await expect(this.lendingManager.withdraw(this.signers[4].address, 100))
          .to.emit(this.lendingManager, `LogWithdrawal`)
          .withArgs(this.signers[4].address, 0);
      });
    });
  });
};
