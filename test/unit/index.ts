import { waffle, ethers } from "hardhat";
import {
  unitDCAManagerFixture,
  unitJobManagerFixture,
} from "../shared/fixtures";
import { Mocks, Signers } from "../shared/types";
import { UnitTest as DCAManagerUnitTest } from "./DCAManager/DCAManager.spec";
import { UnitTest as JobManagerUnitTest } from "./JobManager/JobManager.spec";

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
    DCAManagerUnitTest();
  });

  describe(`JobManager`, async () => {
    beforeEach(async function () {
      const { jobManager } = await this.loadFixture(unitJobManagerFixture);

      this.jobManager = jobManager;
      this.mocks = {} as Mocks;

      // console.log(this.mocks.mockJobManager);
    });
    JobManagerUnitTest();
  });
});
