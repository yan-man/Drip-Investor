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

      describe(`Execute DCA via swap`, async function () {
        it("Should not allow swap for invalid Id", async function () {
          await this.mocks.mockJobManager.mock.isValidId.returns(false);
          await expect(
            this.tradeManager.executeJob(0)
          ).to.be.revertedWithCustomError(
            this.tradeManager,
            `TradeManager__InvalidId`
          );
        });
        it("Should allow swap for valid jobId", async function () {
          await this.mocks.mockJobManager.mock.isValidId.returns(true);
          await expect(this.tradeManager.executeJob(0)).to.be.not.reverted;
        });
        describe(`Events`, async function () {
          it("Should emit on successful executedJob", async function () {
            await this.mocks.mockJobManager.mock.isValidId.returns(true);
            await expect(this.tradeManager.executeJob(0)).to.emit(
              this.tradeManager,
              `LogExecuteJob`
            );
          });
        });
      });
    });
    // it("Should set the right owner", async function () {});
    // it("Should set the right owner", async function () {});
    // it("Should set the right owner", async function () {});
    // it("Should set the right owner", async function () {});
  });
};
