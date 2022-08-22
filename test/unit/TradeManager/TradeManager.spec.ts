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
          this.mocks.mockJobManager.address,
          this.mocks.mockDCAManager.address
        )
      ).to.be.not.reverted;
    });
    it("Should revert deposit if not yet initialized", async function () {
      await expect(
        this.tradeManager.deposit(this.signers[4].address, 100)
      ).to.be.revertedWithCustomError(
        this.tradeManager,
        `TradeManager__NotInitialized`
      );
    });
    it("Should revert swap if not yet initialized", async function () {
      await expect(
        this.tradeManager.executeJob(0)
      ).to.be.revertedWithCustomError(
        this.tradeManager,
        `TradeManager__NotInitialized`
      );
    });
    describe("...After initialization", function () {
      beforeEach(`set trading contract addresses`, async function () {
        await this.tradeManager.setTradingContractAddresses(
          this.mocks.mockLendingManager.address,
          this.mocks.mockDEXManager.address,
          this.mocks.mockJobManager.address,
          this.mocks.mockDCAManager.address
        );
      });
      describe(`Deposits`, async function () {
        it("Should allow deposit for given user address, amount", async function () {
          await this.mocks.mockJobManager.mock.isValidId.returns(true);
          await expect(this.tradeManager.deposit(this.signers[4].address, 100))
            .to.be.not.reverted;
        });
        describe(`Events`, async function () {
          it("Should emit on successful deposit", async function () {
            await this.mocks.mockJobManager.mock.isValidId.returns(true);
            await expect(
              this.tradeManager.deposit(this.signers[4].address, 100)
            )
              .to.emit(this.tradeManager, `LogDeposit`)
              .withArgs(this.signers[4].address, 100);
          });
        });
      });

      describe(`ExecuteJob - DCA via swap`, async function () {
        beforeEach(`...set up mocks`, async function () {
          this._investmentAmount = 100;
          this._user = this.signers[4].address;
          this._jobId = 0;

          await this.mocks.mockJobManager.mock.isValidId.returns(true);
          await this.mocks.mockDCAManager.mock.s_userJobs
            .withArgs(this._user, this._jobId)
            .returns(this._investmentAmount);
          await this.mocks.mockJobManager.mock.s_jobs.returns(
            ethers.BigNumber.from(this._jobId), // jobId
            this._user, // owner address
            ethers.BigNumber.from("0"), // frequencyOptionId
            true, // isActive
            ethers.BigNumber.from("1661074126"), // startTime
            ethers.BigNumber.from(this._investmentAmount) // investmentAmount
          );
        });
        it("Should not allow swap for invalid Id", async function () {
          await this.mocks.mockJobManager.mock.isValidId.returns(false);
          await expect(
            this.tradeManager.executeJob(0)
          ).to.be.revertedWithCustomError(
            this.tradeManager,
            `TradeManager__InvalidId`
          );
        });
        it("Should revert if insufficient deposits", async function () {
          await this.mocks.mockDCAManager.mock.s_userJobs
            .withArgs(this._user, this._jobId)
            .returns(this._investmentAmount - 1);
          await expect(this.tradeManager.executeJob(0)).to.be.reverted;
        });
        it("Should allow swap for valid jobId", async function () {
          await expect(this.tradeManager.executeJob(0)).to.be.not.reverted;
        });
        describe(`Events`, async function () {
          it("Should emit on successful executedJob", async function () {
            await expect(this.tradeManager.executeJob(0)).to.emit(
              this.tradeManager,
              `LogExecuteJob`
            );
          });
        });
      });
    });
  });
};
