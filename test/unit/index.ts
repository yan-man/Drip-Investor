import { waffle, ethers } from "hardhat";
import {
  unitDCAManagerFixture,
  unitJobManagerFixture,
  unitTradeManagerFixture,
  unitKeepersManagerFixture,
  unitLendingManagerFixture,
  unitDEXManagerFixture,
} from "../shared/fixtures";
import { Mocks, Signers } from "../shared/types";
import { UnitTest as DCAManagerUnitTest } from "./DCAManager/DCAManager.spec";
import { UnitTest as JobManagerUnitTest } from "./JobManager/JobManager.spec";
import { UnitTest as KeepersManagerUnitTest } from "./KeepersManager/KeepersManager.spec";
import { UnitTest as TradeManagerUnitTest } from "./TradeManager/TradeManager.spec";
import { UnitTest as LendingManagerUnitTest } from "./LendingManager/LendingManager.spec";
import { UnitTest as DEXManagerUnitTest } from "./DEXManager/DEXManager.spec";
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

  describe(`JobManager`, async () => {
    beforeEach(async function () {
      const { jobManager } = await this.loadFixture(unitJobManagerFixture);

      this.jobManager = jobManager;
      this.mocks = {} as Mocks;

      // console.log(this.mocks.mockJobManager);
    });
    JobManagerUnitTest();
  });

  describe(`TradeManager`, async () => {
    beforeEach(async function () {
      const {
        tradeManager,
        mockJobManager,
        mockLendingManager,
        mockDEXManager,
        mockDCAManager,
      } = await this.loadFixture(unitTradeManagerFixture);
      this.tradeManager = tradeManager;
      this.mocks = {} as Mocks;
      this.mocks.mockJobManager = mockJobManager;
      this.mocks.mockLendingManager = mockLendingManager;
      this.mocks.mockDEXManager = mockDEXManager;
      this.mocks.mockDCAManager = mockDCAManager;
    });
    TradeManagerUnitTest();
  });

  describe(`KeepersManager`, async () => {
    beforeEach(async function () {
      const { keepersManager, mockJobManager, mockTradeManager } =
        await this.loadFixture(unitKeepersManagerFixture);
      this.keepersManager = keepersManager;
      this.mocks = {} as Mocks;
      this.mocks.mockJobManager = mockJobManager;
      this.mocks.mockTradeManager = mockTradeManager;
    });
    KeepersManagerUnitTest();
  });

  describe(`LendingManager`, async () => {
    beforeEach(async function () {
      const {
        lendingManager,
        mockILendingPoolAddressesProvider,
        mockILendingPool,
        mockUsdc,
      } = await this.loadFixture(unitLendingManagerFixture);
      this.lendingManager = lendingManager;
      this.mocks = {} as Mocks;
      this.mocks.mockILendingPoolAddressesProvider =
        mockILendingPoolAddressesProvider;
      this.mocks.mockILendingPool = mockILendingPool;
      this.mocks.mockUsdc = mockUsdc;
    });
    LendingManagerUnitTest();
  });

  describe(`DEXManager`, async () => {
    beforeEach(async function () {
      const {
        dEXManager,
        mockISwapRouter,
        mockUsdc,
        mockWeth,
        mockTransferHelper,
      } = await this.loadFixture(unitDEXManagerFixture);
      this.dEXManager = dEXManager;
      this.mocks = {} as Mocks;
      this.mocks.mockISwapRouter = mockISwapRouter;
      this.mocks.mockUsdc = mockUsdc;
      this.mocks.mockWeth = mockWeth;
      this.mocks.mockTransferHelper = mockTransferHelper;
    });
    DEXManagerUnitTest();
  });
});
