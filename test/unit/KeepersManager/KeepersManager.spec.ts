import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

export const UnitTest = (): void => {
  it("Should revert if checkUpkeep attempted prior to initializing JobManager", async function () {
    await expect(
      this.keepersManager.checkUpkeep(ethers.utils.formatBytes32String(""))
    ).to.be.revertedWithCustomError(
      this.keepersManager,
      `KeepersManager__NotInitialized`
    );
  });
  it("Should set JobManager address", async function () {
    await expect(
      this.keepersManager.setJobManager(this.mocks.mockJobManager.address)
    ).to.not.be.reverted;
  });
  it("Should set TradeManager address", async function () {
    await expect(
      this.keepersManager.setTradeManager(this.mocks.mockTradeManager.address)
    ).to.not.be.reverted;
  });
  describe("Deployment", function () {
    beforeEach(`...set mock contract address`, async function () {
      await this.keepersManager.setJobManager(
        this.mocks.mockJobManager.address
      );
      await this.keepersManager.setTradeManager(
        this.mocks.mockTradeManager.address
      );
    });
    it("Should return based on whether an active job exists", async function () {
      await this.mocks.mockJobManager.mock.isActiveJobs.returns(true);
      const [_upkeepNeeded, _performData] =
        await this.keepersManager.checkUpkeep(
          ethers.utils.formatBytes32String("")
        );
      expect(_upkeepNeeded).to.be.equals(true);
    });
    it("Should return based on whether an active job exists", async function () {
      await this.mocks.mockJobManager.mock.isActiveJobs.returns(false);
      const [_upkeepNeeded, _performData] =
        await this.keepersManager.checkUpkeep(
          ethers.utils.formatBytes32String("")
        );
      expect(_upkeepNeeded).to.be.equals(false);
    });
    it("Should performUpkeep", async function () {
      await expect(
        this.keepersManager.performUpkeep(ethers.utils.formatBytes32String(""))
      ).to.be.not.reverted;
    });
  });
  // it("Should set the right owner", async function () {});
  // it("Should set the right owner", async function () {});
  // it("Should set the right owner", async function () {});
  // it("Should set the right owner", async function () {});
};
