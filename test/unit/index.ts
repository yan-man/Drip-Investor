import { waffle, ethers } from "hardhat";
import {
  unitDCAManagerFixture,
  unitJobManagerFixture,
  unitTradeManagerFixture,
} from "../shared/fixtures";
import { Mocks, Signers } from "../shared/types";
import { UnitTest as DCAManagerUnitTest } from "./DCAManager/DCAManager.spec";
import { UnitTest as JobManagerUnitTest } from "./JobManager/JobManager.spec";
import { UnitTest as TradeManagerUnitTest } from "./TradeManager/TradeManager.spec";

describe(`Unit tests`, async () => {
  before(async function () {
    const wallets = waffle.provider.getWallets();

    this.signers = {} as Signers;
    this.signers = await ethers.getSigners();

    this.loadFixture = waffle.createFixtureLoader(wallets);
  });

  describe(`DCAManager`, async () => {
    beforeEach(async function () {
      const { dCAManager, mockUsdc, mockJobManager, mockTradeManager } =
        await this.loadFixture(unitDCAManagerFixture);

      this.dCAManager = dCAManager;
      this.mocks = {} as Mocks;
      this.mocks.mockUsdc = mockUsdc;
      this.mocks.mockJobManager = mockJobManager;
      this.mocks.mockTradeManager = mockTradeManager;

      // console.log(this.mocks.mockJobManager);
    });
    DCAManagerUnitTest();
  });

  describe(`TradeManager`, async () => {
    beforeEach(async function () {
      const { tradeManager } = await this.loadFixture(unitTradeManagerFixture);
      this.tradeManager = tradeManager;
      this.mocks = {} as Mocks;
    });
    TradeManagerUnitTest();
  });
});
