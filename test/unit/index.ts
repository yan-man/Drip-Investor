import { waffle, ethers } from "hardhat";
import { unitDCAManagerFixture } from "../shared/fixtures";
import { Mocks, Signers } from "../shared/types";
import { DCAUnitTest } from "./DCAManager/DCAManager.spec";

describe(`Unit tests`, async () => {
  before(async function () {
    const wallets = waffle.provider.getWallets();

    this.signers = {} as Signers;
    this.signers = await ethers.getSigners();

    this.loadFixture = waffle.createFixtureLoader(wallets);
  });

  describe(`DCAManager`, async () => {
    beforeEach(async function () {
      const { dCAManager, mockUsdc, mockJobManager } = await this.loadFixture(
        unitDCAManagerFixture
      );

      this.dCAManager = dCAManager;
      this.mocks = {} as Mocks;
      this.mocks.mockUsdc = mockUsdc;
      this.mocks.mockJobManager = mockJobManager;

      // console.log(this.mocks.mockJobManager);
    });
    DCAUnitTest();
  });
});
